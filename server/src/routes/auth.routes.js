import express from "express";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

// Teacher only register
router.post("/register", authController.teacherRegister);

// Login for all roles
router.post("/login", authController.login);

export default router;
