import express from "express";
import { handleUpload } from "../middlewares/upload.middleware.js";
import { requireRole } from "../middlewares/auth.middleware.js";
import * as printRequestController from "../controllers/printRequest.controller.js";

const router = express.Router();

/* ---------------- Employee ---------------- */
// Employee creates print request
router.post(
    "/",
    requireRole(["EMPLOYEE"]),
    handleUpload,
    printRequestController.createPrintRequest
);

// Employee / Admin / Printing can view requests (filtered by role in controller)
router.get(
    "/",
    requireRole(["EMPLOYEE", "ADMIN", "PRINTING"]),
    printRequestController.getPrintRequests
);

// Preview File
router.get(
    "/:id/preview",
    requireRole(["EMPLOYEE", "ADMIN", "PRINTING"]),
    printRequestController.getPrintFile
);

/* ---------------- Admin ---------------- */
// Admin approves request
router.put(
    "/:id/approve",
    requireRole(["ADMIN"]),
    printRequestController.approvePrintRequest
);

// Admin rejects request
router.put(
    "/:id/reject",
    requireRole(["ADMIN"]),
    printRequestController.rejectPrintRequest
);

/* ---------------- Printing Department ---------------- */
// Printing department updates status
router.put(
    "/:id/status",
    requireRole(["PRINTING"]),
    printRequestController.updatePrintStatus
);

// Printing department downloads file
router.get(
    "/:id/download",
    requireRole(["PRINTING"]),
    printRequestController.downloadPrintFile
);

// Delete Request (Admin or Employee)
router.delete(
    "/:id",
    requireRole(["ADMIN", "EMPLOYEE"]),
    printRequestController.deletePrintRequest
);

export default router;
