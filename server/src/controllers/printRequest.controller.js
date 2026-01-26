import PrintRequest from "../models/PrintRequest.js";
import { getIO } from "../config/socket.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs";
import path from "path";
import cloudinary from "../config/cloudinary.js";

/* ----------------------------------------
   CREATE PRINT REQUEST (Employee)
----------------------------------------- */
export const createPrintRequest = asyncHandler(async (req, res) => {
    const { title, copies, printType, deliveryType, deliveryRoom, dueDateTime } = req.body;

    if (!req.file) {
        throw new ApiError(400, "File is required");
    }

    if (!title || !copies || !printType || !deliveryType || !dueDateTime) {
        // Clean up uploaded file if validation fails
        if (req.file.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        throw new ApiError(400, "Missing required fields");
    }

    const newRequest = await PrintRequest.create({
        employee: req.user.userId,
        organization: req.user.organizationId,
        title,
        fileUrl: req.file.path, // Cloudinary URL
        cloudinaryId: req.file.filename, // Cloudinary Public ID
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        originalName: req.file.originalname,
        copies,
        printType,
        deliveryType,
        deliveryRoom,
        dueDateTime: new Date(dueDateTime),
    });

    res.status(201).json({
        success: true,
        message: "Print request created successfully",
        request: newRequest,
    });
});

/* ----------------------------------------
   GET ALL PRINT REQUESTS
----------------------------------------- */
export const getPrintRequests = asyncHandler(async (req, res) => {
    const { role, userId } = req.user;
    const { status, page = 1, limit = 10 } = req.query;

    const query = {
        organization: req.user.organizationId,
    };

    if (role === "EMPLOYEE") {
        query.employee = userId;
    }

    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const requests = await PrintRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("employee", "name email");

    const total = await PrintRequest.countDocuments(query);

    res.json({
        success: true,
        data: requests,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        },
    });
});

/* ----------------------------------------
   GET SINGLE PRINT REQUEST
----------------------------------------- */
export const getPrintRequestById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role, userId } = req.user;

    const request = await PrintRequest.findById(id).populate("employee", "name email");

    if (!request) throw new ApiError(404, "Print request not found");

    if (request.organization.toString() !== req.user.organizationId) {
        throw new ApiError(403, "Access denied");
    }

    let canAccess = false;
    if (role === "ADMIN" || role === "PRINTING") canAccess = true;
    else if (role === "EMPLOYEE" && request.employee._id.toString() === userId) canAccess = true;

    if (!canAccess) throw new ApiError(403, "Access denied");

    res.json({ success: true, request });
});

/* ----------------------------------------
   APPROVE PRINT REQUEST (Admin)
----------------------------------------- */
export const approvePrintRequest = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const request = await PrintRequest.findById(id);
    if (!request) throw new ApiError(404, "Print request not found");
    if (request.organization.toString() !== req.user.organizationId) throw new ApiError(403, "Access denied");

    request.status = "APPROVED";
    await request.save();

    const io = getIO();
    io.to(req.user.organizationId).emit("notify_employee", {
        type: "APPROVED",
        requestId: request._id,
        message: "Your print request has been approved",
    });

    // Notify Printing Dept
    io.to(req.user.organizationId).emit("notify_printing", {
        type: "NEW_JOB",
        requestId: request._id,
        message: "A new print request is ready for processing",
    });

    res.json({ success: true, message: "Print request approved", request });
});

/* ----------------------------------------
   REJECT PRINT REQUEST (Admin)
----------------------------------------- */
export const rejectPrintRequest = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const request = await PrintRequest.findById(id);
    if (!request) throw new ApiError(404, "Print request not found");
    if (request.organization.toString() !== req.user.organizationId) throw new ApiError(403, "Access denied");

    request.status = "REJECTED";
    await request.save();

    const io = getIO();
    io.to(req.user.organizationId).emit("notify_employee", {
        type: "REJECTED",
        requestId: request._id,
        message: "Your print request has been rejected",
    });

    res.json({ success: true, message: "Print request rejected", request });
});

/* ----------------------------------------
   UPDATE STATUS (Printing Department)
----------------------------------------- */
export const updatePrintStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const { role } = req.user;

    if (role !== "ADMIN" && role !== "PRINTING") throw new ApiError(403, "Not authorized");

    const request = await PrintRequest.findById(id);
    if (!request) throw new ApiError(404, "Print request not found");
    if (request.organization.toString() !== req.user.organizationId) throw new ApiError(403, "Access denied");

    request.status = status;
    await request.save();

    const io = getIO();
    io.to(req.user.organizationId).emit("notify_employee", {
        type: "STATUS_UPDATE",
        requestId: request._id,
        status: request.status,
        message: `Your print request status is now: ${status}`,
    });

    res.json({ success: true, message: `Print request status updated to ${status}`, request });
});

/* ----------------------------------------
   GET PREVIEW URL / SERVE FILE MAPPER
----------------------------------------- */
export const getPrintFileSignedUrl = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role, userId } = req.user;

    const request = await PrintRequest.findById(id);
    if (!request) throw new ApiError(404, "Print request not found");

    if (request.organization.toString() !== req.user.organizationId) {
        throw new ApiError(403, "Access denied");
    }

    let canAccess = false;
    if (role === "ADMIN" || role === "PRINTING") canAccess = true;
    else if (role === "EMPLOYEE" && request.employee.toString() === userId) canAccess = true;

    if (!canAccess) throw new ApiError(403, "Access denied");

    const serverUrl = `${req.protocol}://${req.get('host')}`;
    const fileServeUrl = `${serverUrl}/api/print-requests/${id}/file`;

    return res.json({ success: true, url: fileServeUrl });
});

/* ----------------------------------------
   SERVE FILE CONTENT (Stream)
----------------------------------------- */
export const servePrintFile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role, userId } = req.user;

    console.log(`[ServeFile] Request for ID: ${id} by User: ${userId} (${role})`);

    const request = await PrintRequest.findById(id);
    if (!request) {
        console.error(`[ServeFile] Request ${id} not found in DB`);
        return res.status(404).send("File not found");
    }

    if (request.organization.toString() !== req.user.organizationId) {
        console.error(`[ServeFile] Org mismatch`);
        return res.status(403).send("Denied");
    }

    let canAccess = false;
    if (role === "ADMIN" || role === "PRINTING") canAccess = true;
    else if (role === "EMPLOYEE" && request.employee.toString() === userId) canAccess = true;

    if (!canAccess) {
        console.error(`[ServeFile] Access Denied for role ${role}`);
        return res.status(403).send("Denied");
    }

    // Cloudinary Serve (Primary - Private & Signed)
    if (request.cloudinaryId) {
        // Generate Signed URL dynamically
        // Note: For PDFs/Docs 'resource_type' handles the switch between 'image' and 'raw/video' etc.
        // 'auto' might not solve it for url() method as nicely as upload().
        // We can infer from fileUrl or attempt 'auto'.
        // However, cloudinary.url default resource_type is 'image'.

        let resourceType = 'image';
        if (request.fileType === 'application/pdf') resourceType = 'image'; // Cloudinary treats PDF as image for delivery often, but 'raw' for others.
        // Actually, for creating a link to the original file:
        // Use 'auto' if possible, or infer.
        // Safest is to check fileType.

        if (!request.fileType.startsWith('image/') && request.fileType !== 'application/pdf') {
            resourceType = 'raw';
            // Note: PDFs are 'image' resource_type in Cloudinary typically? 
            // Actually, PDF upload as 'auto' -> usually 'image'.
            // Docx/Zip upload as 'auto' -> 'raw'.
        }

        // Better heuristic: if URL contains '/raw/', it is raw.
        if (request.fileUrl && request.fileUrl.includes('/raw/')) {
            resourceType = 'raw';
        }

        const url = cloudinary.url(request.cloudinaryId, {
            resource_type: resourceType,
            type: 'private',
            sign_url: true,
            secure: true,
            expires_in: 3600 // 1 hour access
        });

        console.log(`[ServeFile] Redirecting to Signed URL: ${url}`);
        return res.redirect(url);
    }

    // Legacy Public/Local Fallback
    if (request.fileUrl && request.fileUrl.startsWith('http')) {
        console.log(`[ServeFile] Redirecting to Public Cloudinary: ${request.fileUrl}`);
        return res.redirect(request.fileUrl);
    }

    // Local File Fallback (For legacy files)
    console.log(`[ServeFile] DB stored path: ${request.fileUrl}`);

    const filePath = path.resolve(request.fileUrl);
    console.log(`[ServeFile] Resolved FS Path: ${filePath}`);

    if (!fs.existsSync(filePath)) {
        console.error(`[ServeFile] FILE MISSING AT PATH: ${filePath}`);
        // Fallback: Try looking in 'uploads' relative to cwd if absolute failed?
        const fallbackPath = path.join(process.cwd(), 'uploads', path.basename(request.fileUrl));
        if (fs.existsSync(fallbackPath)) {
            console.log(`[ServeFile] Found at fallback path: ${fallbackPath}`);
            res.setHeader('Content-Type', request.fileType || 'application/octet-stream');
            res.setHeader('Content-Disposition', `inline; filename="${request.originalName}"`);
            return res.sendFile(fallbackPath);
        }

        return res.status(404).send("File missing on disk");
    }

    res.setHeader('Content-Type', request.fileType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${request.originalName}"`);

    res.sendFile(filePath);
});

/* ----------------------------------------
   DOWNLOAD FILE (Printing Dept)
----------------------------------------- */
export const downloadPrintFile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const request = await PrintRequest.findById(id);
    if (!request) throw new ApiError(404, "Not found");
    if (request.organization.toString() !== req.user.organizationId) throw new ApiError(403, "Denied");

    const filePath = path.resolve(request.fileUrl);
    if (!fs.existsSync(filePath)) throw new ApiError(404, "File missing");

    const io = getIO();
    io.to(req.user.organizationId).emit("notify_employee", {
        type: "FILE_DOWNLOADED",
        requestId: request._id,
        message: "Printing dept downloaded your file",
    });

    res.download(filePath, request.originalName);
});

/* ----------------------------------------
   DELETE PRINT REQUEST
----------------------------------------- */
export const deletePrintRequest = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role, userId } = req.user;

    const request = await PrintRequest.findById(id);
    if (!request) throw new ApiError(404, "Print request not found");

    if (request.organization.toString() !== req.user.organizationId) throw new ApiError(403, "Access denied");

    let canDelete = false;
    if (role === "ADMIN") canDelete = true;
    else if (role === "EMPLOYEE" && request.employee.toString() === userId) {
        if (["PENDING", "REJECTED", "COMPLETED"].includes(request.status)) canDelete = true;
    }

    if (!canDelete) throw new ApiError(403, "Not authorized to delete this request");

    // Delete from Cloudinary if it exists
    if (request.cloudinaryId) {
        try {
            await cloudinary.uploader.destroy(request.cloudinaryId);
            console.log(`[Delete] Removed Cloudinary file: ${request.cloudinaryId}`);
        } catch (err) {
            console.error("Failed to delete Cloudinary file:", err);
        }
    } else if (request.fileUrl && !request.fileUrl.startsWith('http')) {
        // Local file deletion fallback
        const filePath = path.resolve(request.fileUrl);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (err) {
                console.error("Failed to delete local file:", err);
            }
        }
    }

    await request.deleteOne();

    res.json({
        success: true,
        message: "Print request deleted successfully"
    });
});
