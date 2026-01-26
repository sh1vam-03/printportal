import PrintRequest from "../models/PrintRequest.js";
import { getIO } from "../config/socket.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs";
import path from "path";

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

    // Normalized path for storage (relative to project root)
    // multer stores in 'uploads/', so req.file.path is relative.

    const newRequest = await PrintRequest.create({
        employee: req.user.userId,
        organization: req.user.organizationId,
        title,
        fileUrl: req.file.path, // Store local path
        cloudinaryId: null, // No longer used
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
        requests,
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
   UPDATE STATUS (Admin/Printing)
----------------------------------------- */
export const updatePrintRequestStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const { role } = req.user;

    if (role !== "ADMIN" && role !== "PRINTING") {
        throw new ApiError(403, "Not authorized to update status");
    }

    const request = await PrintRequest.findById(id);
    if (!request) throw new ApiError(404, "Print request not found");

    if (request.organization.toString() !== req.user.organizationId) {
        throw new ApiError(403, "Access denied");
    }

    request.status = status;
    await request.save();

    // Notifications...
    const io = getIO();
    io.to(req.user.organizationId).emit("notify_employee", {
        type: "STATUS_UPDATE",
        requestId: request._id,
        status: request.status,
        message: `Your print request status is now: ${status}`,
    });

    res.json({
        success: true,
        message: "Status updated successfully",
        request,
    });
});

/* ----------------------------------------
   GET PREVIEW URL / SERVE FILE
   This endpoint now serves two purposes:
   1. It returns the URL to the file serving endpoint for the frontend.
   2. OR it serves the file directly if called with proper headers/response type.
   
   To keep frontend simple, let's keep this as "Get File URL" (JSON).
   The frontend will then use that URL in an iframe/image tag.
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

    // Construct the Serving URL
    // This URL will point to a new route: GET /api/print-requests/:id/file
    // OR we can misuse this same route but check Accept header? No, duplicate route is cleaner.
    // For now, let's assume we create a route "/:id/file".

    // Actually, to make it super simple for the existing frontend:
    // The frontend expects { url: "..." }. 
    // We return a URL that points to our backend file serving endpoint.
    // The frontend will invoke that URL with the auth token (Cookie/Header).

    // NOTE: Sending a File via API in <img> tag or <iframe> requires Cookies (since we can't add headers easily).
    // If the app relies on Authorization Header, <iframe> won't work easily.
    // WORKAROUND: Short-lived token in query param? Or just relying on Cookies.

    const serverUrl = `${req.protocol}://${req.get('host')}`;
    const fileServeUrl = `${serverUrl}/api/print-requests/${id}/file`;

    return res.json({ success: true, url: fileServeUrl });
});

/* ----------------------------------------
   SERVE FILE CONTENT (Stream)
   GET /api/print-requests/:id/file
----------------------------------------- */
export const servePrintFile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Auth is handled by middleware, user is populated
    const { role, userId } = req.user;

    const request = await PrintRequest.findById(id);
    if (!request) return res.status(404).send("File not found");

    if (request.organization.toString() !== req.user.organizationId) return res.status(403).send("Denied");

    let canAccess = false;
    if (role === "ADMIN" || role === "PRINTING") canAccess = true;
    else if (role === "EMPLOYEE" && request.employee.toString() === userId) canAccess = true;

    if (!canAccess) return res.status(403).send("Denied");

    // Legacy Cloudinary Handover
    if (request.fileUrl.startsWith('http')) {
        return res.redirect(request.fileUrl);
    }

    const filePath = path.resolve(request.fileUrl);
    if (!fs.existsSync(filePath)) return res.status(404).send("File missing on disk");

    // Set correct content type
    res.setHeader('Content-Type', request.fileType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${request.originalName}"`);

    res.sendFile(filePath);
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

    // Delete Local File
    if (request.fileUrl && !request.fileUrl.startsWith('http')) {
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
