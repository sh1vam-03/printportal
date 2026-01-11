import express from "express";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

// Register new Organization (SaaS Signup)
router.post("/signup-org", authController.signupOrganization);

// Login for all roles
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

export default router;
