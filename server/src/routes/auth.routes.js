import express from "express";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

// Register new Organization (SaaS Signup)
router.post("/signup-org", authController.signupOrganization);

// Login for all roles
router.post("/login", authController.login);

export default router;
