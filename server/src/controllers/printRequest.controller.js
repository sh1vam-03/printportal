import PrintRequest from "../models/PrintRequest.js";
import { getIO } from "../config/socket.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

/* ----------------------------------------
   CREATE PRINT REQUEST (Teacher)
----------------------------------------- */
export const createPrintRequest = asyncHandler(async (req, res) => {

    const {
        teacherId,
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
        teacher: teacherId,
        title,
        fileUrl: `/uploads/${req.file.filename}`,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        originalName: req.file.originalname,
        copies,
        printType,
        deliveryType,
        deliveryRoom,
        dueDateTime,
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

export const getPrintFile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role, _id: userId } = req.user; // Securely get from token

    const request = await PrintRequest.findById(id);

    if (!request) {
        throw new ApiError(404, "Print request not found");
    }

    // Authorization Check
    let canAccess = false;

    // Admin and Printing can access all
    if (role === "ADMIN" || role === "PRINTING") {
        canAccess = true;
    }
    // Teacher can only access their own
    else if (role === "TEACHER" && request.teacher.toString() === userId) {
        canAccess = true;
    }

    if (!canAccess) {
        throw new ApiError(403, "Access denied to this file");
    }

    // Serve file inline for preview
    // request.fileUrl is like "/uploads/filename.ext"
    // Remove leading slash for safe join
    const relativeUrl = request.fileUrl.startsWith('/') ? request.fileUrl.substring(1) : request.fileUrl;

    // Path: CWD/src/uploads/file
    const filePath = path.join(process.cwd(), "src", relativeUrl);

    console.log(`[Preview] Request ID: ${id}`);
    console.log(`[Preview] fileUrl in DB: ${request.fileUrl}`);
    console.log(`[Preview] Resolved Path: ${filePath}`);

    if (!fs.existsSync(filePath)) {
        console.error(`[Preview] File NOT FOUND at ${filePath}`);
        throw new ApiError(404, "File not found on server");
    }

    // Fallback for old files without metadata
    const contentType = request.fileType || getMimeType(request.fileUrl);
    const downloadName = request.originalName || path.basename(request.fileUrl);

    console.log(`[Preview] Content-Type: ${contentType}`);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${downloadName}"`);

    res.sendFile(filePath);
});

/* ----------------------------------------
   DELETE PRINT REQUEST (Admin & Teacher)
----------------------------------------- */
import fs from "fs";

export const deletePrintRequest = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role, _id: userId } = req.user;

    const request = await PrintRequest.findById(id);

    if (!request) {
        throw new ApiError(404, "Print request not found");
    }

    // Authorization Check with Status Rules
    let canDelete = false;

    if (role === "TEACHER" && request.teacher.toString() === userId) {
        // Teacher can delete: PENDING, REJECTED, COMPLETED
        // Teacher CANNOT delete: APPROVED, IN_PROGRESS (Printing dept needs it)
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

    // Delete File from storage
    const filePath = `./src${request.fileUrl}`;
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
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

    if (role === "TEACHER") {
        filter.teacher = userId;
    }

    if (role === "PRINTING") {
        filter.status = "APPROVED";
    }

    // Admins see all by default, or can filter if needed (future feature)

    const requests = await PrintRequest.find(filter)
        .populate("teacher", "name email")
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

    // Notify Teacher
    io.emit("notify_teacher", {
        type: "APPROVED",
        requestId: request._id,
        message: "Your print request has been approved",
    });

    // Notify Printing Department
    io.emit("notify_printing", {
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

    // Notificaton Only Teacher
    const io = getIO();

    io.emit("notify_teacher", {
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

    // Notification Only Teacher

    const io = getIO();

    io.emit("notify_teacher", {
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
        "teacher",
        "name email"
    );

    if (!request) {
        throw new ApiError(404, "Print request not found");
    }

    // Notification Only Teacher
    const io = getIO();

    io.emit("notify_teacher", {
        type: "FILE_DOWNLOADED",
        requestId: request._id,
        message: "Your document has been downloaded by the printing department",
    });

    // Serve file
    // fileUrl is stored as "/uploads/filename", but files are in "src/uploads"
    const filePath = `./src${request.fileUrl}`;
    res.download(filePath);
});
