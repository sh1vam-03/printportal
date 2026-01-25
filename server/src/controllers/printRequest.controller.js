import PrintRequest from "../models/PrintRequest.js";
import { getIO } from "../config/socket.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


/* ----------------------------------------
   CREATE PRINT REQUEST (Employee)
----------------------------------------- */
export const createPrintRequest = asyncHandler(async (req, res) => {

    const {
        // employeeId removed, using req.user.userId
        title,
        copies,
        printType,
        deliveryType,
        deliveryRoom,
        dueDateTime,
    } = req.body;

    if (!req.file) {
        throw new ApiError(400, "File is required");
    }

    if (!title || !copies || !printType || !deliveryType || !dueDateTime) {
        throw new ApiError(400, "Missing required fields");
    }


    const newRequest = await PrintRequest.create({
        employee: req.user.userId,
        organization: req.user.organizationId,
        title,
        fileUrl: req.file.path, // Cloudinary secure URL
        cloudinaryId: req.file.filename, // Cloudinary public_id
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        originalName: req.file.originalname,
        copies,
        printType,
        deliveryType,
        deliveryRoom,
        dueDateTime: new Date(dueDateTime + "+05:30"),
    });

    res.status(201).json({
        success: true,
        message: "Print request created successfully",
        data: newRequest,
    });

});

/* ----------------------------------------
   GET PRINT FILE PREVIEW (Secure)
----------------------------------------- */
import path from "path";

const getMimeType = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case ".pdf": return "application/pdf";
        case ".jpg":
        case ".jpeg": return "image/jpeg";
        case ".png": return "image/png";
        case ".txt": return "text/plain";
        default: return "application/octet-stream";
    }
};

import axios from "axios";
import cloudinary from "../config/cloudinary.config.js";

export const getPrintFile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role, userId } = req.user; // Securely get from token

    const request = await PrintRequest.findById(id);

    if (!request) {
        throw new ApiError(404, "Print request not found");
    }

    // Authorization Check
    // 0. Organization Check (Crucial for SaaS)
    if (request.organization.toString() !== req.user.organizationId) {
        throw new ApiError(403, "Access denied to this file");
    }

    let canAccess = false;

    // Admin and Printing can access all
    if (role === "ADMIN" || role === "PRINTING") {
        canAccess = true;
    }
    // Employee can only access their own
    else if (role === "EMPLOYEE" && request.employee.toString() === userId) {
        canAccess = true;
    }

    if (!canAccess) {
        throw new ApiError(403, "Access denied to this file");
    }

    // Cloudinary files: PROXY content instead of redirecting (Solves CORS/Viewer issues)
    if (request.cloudinaryId) {
        try {
            // Generate a SIGNED URL to access private/authenticated resources
            // We must match the resource_type used during upload ('raw' for docs/PDFs using Blob logic)
            // If the fileUrl contains 'image/upload', it might be an image, but PDF uploads in middleware were 'raw'.
            // Safest check: look at fileType or just try 'raw' first for PDFs.

            const isPdf = request.fileType === 'application/pdf' || request.fileUrl.endsWith('.pdf');
            const resourceType = isPdf ? 'raw' : 'image';

            // Generate signed URL with Cloudinary SDK
            const signedUrl = cloudinary.url(request.cloudinaryId, {
                resource_type: resourceType,
                type: 'authenticated', // Try 'authenticated' for private files
                sign_url: true,
                secure: true,
                expires_at: Math.floor(Date.now() / 1000) + 3600 // Valid for 1 hour
            });

            console.log(`[Preview] Proxying via Signed URL: ${signedUrl}`);

            // Fetch the signed URL
            const response = await axios.get(signedUrl, {
                responseType: 'stream'
            });

            // Set appropriate headers
            const contentType = request.fileType || response.headers['content-type'] || 'application/pdf';
            res.setHeader('Content-Type', contentType);
            // Inline disposition to display in browser (not download)
            res.setHeader('Content-Disposition', `inline; filename="${request.originalName || 'document.pdf'}"`);

            // Pipe data to response
            response.data.pipe(res);
            return;
        } catch (error) {
            console.error('[Preview] Failed to proxy file:', error.message, error.response?.status);

            // If the first attempt failed (maybe it was 'upload' type not 'authenticated'?), try fallback?
            // Usually 401/404 means wrong type. But strictly speaking, we should just fail safely.

            throw new ApiError(502, "Failed to fetch file from storage provider");
        }
    }

    // Backward compatibility: Serve local files
    const relativeUrl = request.fileUrl.startsWith('/') ? request.fileUrl.substring(1) : request.fileUrl;
    const filePath = path.join(process.cwd(), "src", relativeUrl);

    if (!fs.existsSync(filePath)) {
        throw new ApiError(404, "File not found on server");
    }

    const contentType = request.fileType || getMimeType(request.fileUrl);
    const downloadName = request.originalName || path.basename(request.fileUrl);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${downloadName}"`);

    res.sendFile(filePath);
});

/* ----------------------------------------
   DELETE PRINT REQUEST (Admin & employee)
----------------------------------------- */
import fs from "fs";

export const deletePrintRequest = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role, userId } = req.user;

    const request = await PrintRequest.findById(id);

    if (!request) {
        throw new ApiError(404, "Print request not found");
    }

    // Authorization Check with Status Rules
    let canDelete = false;

    if (role === "EMPLOYEE" && request.employee.toString() === userId) {
        // Employee can delete: PENDING, REJECTED, COMPLETED
        // Employee CANNOT delete: APPROVED, IN_PROGRESS (Printing dept needs it)
        if (["PENDING", "REJECTED", "COMPLETED"].includes(request.status)) {
            canDelete = true;
        } else {
            throw new ApiError(403, "Cannot delete file while it is being processed by Printing Dept");
        }
    } else if (role === "ADMIN") {
        // Admin can delete: APPROVED, IN_PROGRESS, COMPLETED, REJECTED
        // Admin CANNOT delete: PENDING (Must approve/reject first)
        if (request.status !== "PENDING") {
            canDelete = true;
        } else {
            throw new ApiError(403, "Cannot delete Pending request. Please Approve or Reject it first.");
        }
    }

    if (!canDelete) {
        throw new ApiError(403, "Not authorized to delete this request");
    }

    // Delete File from Cloudinary
    if (request.cloudinaryId) {
        try {
            await cloudinary.uploader.destroy(request.cloudinaryId);
            console.log(`✅ Deleted file from Cloudinary: ${request.cloudinaryId}`);
        } catch (err) {
            console.error('⚠️  Failed to delete file from Cloudinary:', err);
            // Continue with request deletion even if Cloudinary deletion fails
        }
    } else {
        // Backward compatibility: Delete local file if no cloudinaryId
        const filePath = `./src${request.fileUrl}`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    // Delete Record
    await request.deleteOne();

    res.json({
        success: true,
        message: "Print request deleted successfully",
    });
});


/* ----------------------------------------
   GET PRINT REQUESTS (Role-based)
----------------------------------------- */
export const getPrintRequests = asyncHandler(async (req, res) => {
    // Securely get role and userId from token (req.user is set by auth middleware)
    const { role, userId } = req.user;

    // Optional query overrides ONLY for Admin
    // const { role: queryRole, userId: queryUserId } = req.query;

    let filter = {};

    if (role === "EMPLOYEE" && (filter.employee = userId));

    if (role === "PRINTING") {
        filter.status = { $in: ["APPROVED", "IN_PROGRESS"] };
    }

    // Admins see all by default, or can filter if needed (future feature)
    // ALWAYS filter by organization for data isolation
    filter.organization = req.user.organizationId;

    const requests = await PrintRequest.find(filter)
        .populate("employee", "name email")
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        data: requests,
    });
});


/* ----------------------------------------
   APPROVE PRINT REQUEST (Admin)
----------------------------------------- */
export const approvePrintRequest = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const request = await PrintRequest.findById(id);

    if (!request) {
        throw new ApiError(404, "Print request not found");
    }

    request.status = "APPROVED";
    await request.save();


    const io = getIO();

    // Notify employee
    // Notify employee - Targeted
    // In a real app we might join user-specific rooms "user_ID"
    // For now, if we emit to Org room, everyone in Org gets it, but frontend filters?
    // BETTER: Emit to organization room, let frontend decide or backend smarts.
    // Ideally: io.to(request.employee.toString()).emit(...) 
    // BUT we are keeping it simple: Emit to ORG room.

    // Notify EVERYONE in the ORG (Employee + Admin + Printing)
    io.to(req.user.organizationId).emit("notify_employee", {
        type: "APPROVED",
        requestId: request._id,
        message: "Your print request has been approved",
    });

    // Notify Printing Department (Also in the same Org Room)
    io.to(req.user.organizationId).emit("notify_printing", {
        type: "NEW_JOB",
        requestId: request._id,
        message: "A new print request is ready for processing",
    });

    res.json({
        success: true,
        message: "Print request approved",
        data: request,
    });
});

/* ----------------------------------------
   REJECT PRINT REQUEST (Admin)
----------------------------------------- */
export const rejectPrintRequest = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const request = await PrintRequest.findById(id);

    if (!request) {
        throw new ApiError(404, "Print request not found");
    }

    request.status = "REJECTED";
    await request.save();

    // Notificaton Only Employee
    const io = getIO();

    io.to(req.user.organizationId).emit("notify_employee", {
        type: "REJECTED",
        requestId: request._id,
        message: "Your print request has been rejected",
    });


    res.json({
        success: true,
        message: "Print request rejected",
        data: request,
    });
});


/* ----------------------------------------
   UPDATE PRINT STATUS (Printing Department)
----------------------------------------- */
export const updatePrintStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["IN_PROGRESS", "COMPLETED"];

    if (!allowedStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status update");
    }

    const request = await PrintRequest.findById(id);

    if (!request) {
        throw new ApiError(404, "Print request not found");
    }

    if (request.status !== "APPROVED" && request.status !== "IN_PROGRESS") {
        throw new ApiError(400, "Status update not allowed for this request");
    }

    request.status = status;
    await request.save();

    // Notification Only Employee

    const io = getIO();

    io.to(req.user.organizationId).emit("notify_employee", {
        type: "STATUS_UPDATE",
        requestId: request._id,
        status: request.status,
        message: `${request.status === "COMPLETED" ? "Your printing request has been completed" : "Your printing request is being processed"}`,
    });


    res.json({
        success: true,
        message: `Print request status updated to ${status}`,
        data: request,
    });
});


/* ----------------------------------------
   DOWNLOAD FILE (Printing Department)
----------------------------------------- */
export const downloadPrintFile = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const request = await PrintRequest.findById(id).populate(
        "employee",
        "name email"
    );

    if (!request) {
        throw new ApiError(404, "Print request not found");
    }

    // Notification Only Employee
    const io = getIO();

    io.to(req.user.organizationId).emit("notify_employee", {
        type: "FILE_DOWNLOADED",
        requestId: request._id,
        message: "Your document has been downloaded by the printing department",
    });

    // Cloudinary files: Redirect to Cloudinary URL with download disposition
    if (request.cloudinaryId) {
        // Add download flag to Cloudinary URL
        const downloadUrl = request.fileUrl.replace('/upload/', '/upload/fl_attachment/');
        return res.redirect(downloadUrl);
    }

    // Backward compatibility: Serve local file
    const filePath = `./src${request.fileUrl}`;
    res.download(filePath);
});
