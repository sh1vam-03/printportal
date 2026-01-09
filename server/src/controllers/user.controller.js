import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcryptjs";

/* ---------------- CREATE NEW USER (ADMIN ONLY) ---------------- */
export const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    // Restrict strictly to TEACHER creation
    if (role !== "TEACHER") {
        throw new ApiError(403, "Admins can only create Teacher accounts.");
    }

    const existing = await User.findOne({ email });
    if (existing) {
        throw new ApiError(400, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        isActive: true,
    });

    res.status(201).json({
        success: true,
        message: `${role} account created successfully`,
        data: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        },
    });
});

/* ---------------- GET ALL USERS (ADMIN ONLY) ---------------- */
export const getUsers = asyncHandler(async (req, res) => {
    // Exclude current admin from list to prevent self-deletion issues
    const users = await User.find({ _id: { $ne: req.user.userId } })
        .select("-password")
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        data: users,
    });
});

/* ---------------- DELETE USER (ADMIN ONLY) ---------------- */
export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Optional: Prevent deleting other admins if needed, but requirements say "delete specific teacher account"
    // We will allow deleting anyone except self (handled by exclusion in getUsers or explicit check)
    if (id === req.user.userId) {
        throw new ApiError(400, "Cannot delete your own account");
    }

    await User.findByIdAndDelete(id);

    res.json({
        success: true,
        message: "User account deleted successfully",
    });
});

/* ---------------- TERMINATE SESSION (ADMIN ONLY) ---------------- */
export const terminateSession = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Increment token version to invalidate all current JWTs
    user.tokenVersion += 1;
    await user.save();

    res.json({
        success: true,
        message: "User session terminated successfully. Verification required on next request.",
    });
});
