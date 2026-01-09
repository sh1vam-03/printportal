import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ---------------- TEACHER SIGNUP (DISABLED) ---------------- */
// Public registration disabled. Use Admin User Management.
export const teacherRegister = asyncHandler(async (req, res) => {
    throw new ApiError(403, "Public registration is disabled.");
});

/* ---------------- LOGIN (ALL ROLES) ---------------- */
export const login = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    if (!user.isActive) {
        throw new ApiError(403, "Account is disabled. Please contact Administrator.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Include tokenVersion in payload
    const token = generateToken({
        userId: user._id,
        role: user.role,
        tokenVersion: user.tokenVersion
    });

    res.json({
        success: true,
        message: "Login successful",
        token,
        role: user.role,
        name: user.name,
    });
});
