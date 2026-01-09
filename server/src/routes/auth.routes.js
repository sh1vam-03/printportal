import express from "express";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

// Teacher register REMOVED (Admin only creation now)
// router.post("/register", authController.teacherRegister);

// Login for all roles
router.post("/login", authController.login);

export default router;
