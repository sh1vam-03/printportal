import express from "express";
import printRequestRoutes from "./printRequest.routes.js";
import authRoutes from "./auth.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = express.Router();

router.use("/print-requests", printRequestRoutes);
router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
