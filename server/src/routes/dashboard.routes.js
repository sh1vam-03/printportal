import express from "express";
import { requireRole } from "../middlewares/auth.middleware.js";
import * as dashboardController from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/stats", requireRole(["ADMIN", "TEACHER", "PRINTING"]), dashboardController.getDashboardStats);

export default router;
