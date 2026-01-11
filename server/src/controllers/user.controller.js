import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import RefreshToken from "../models/RefreshToken.js";

import Organization from "../models/Organization.js";

/* ---------------- CREATE NEW USER (ADMIN ONLY) ---------------- */
export const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    // Allow creation of EMPLOYEE and PRINTING roles
    if (!["EMPLOYEE", "PRINTING"].includes(role)) {
        throw new ApiError(403, "Admins can only create Employee or Printing accounts.");
    }

    // 1. Fetch Organization & Plan
    const organization = await Organization.findById(req.user.organizationId);
    if (!organization) {
        throw new ApiError(404, "Organization not found");
    }

    const plan = organization.subscriptionPlan; // STARTER, PROFESSIONAL, ENTERPRISE

    // 2. Define Limits
    let limits = {
        EMPLOYEE: Infinity,
        PRINTING: Infinity
    };

    if (plan === "STARTER") {
        // "Starter Plan" limits
        limits = { EMPLOYEE: 20, PRINTING: 1 };
    } else if (plan === "PROFESSIONAL") {
        // "Professional Plan" limits
        limits = { EMPLOYEE: 100, PRINTING: 1 };
    }
    // ENTERPRISE = Infinity

    // 3. Check Current Usage
    const currentCount = await User.countDocuments({
        organization: req.user.organizationId,
        role: role
    });

    if (currentCount >= limits[role]) {
        let msg = "";
        if (role === "PRINTING") {
            msg = "You already have one printing staff if you want more please upgrade your plan";
        } else {
            msg = "Upgrade for more employe";
        }
        throw new ApiError(403, msg);
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
        role,
        isActive: true,
        organization: req.user.organizationId,
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
    const users = await User.find({
        _id: { $ne: req.user.userId },
        organization: req.user.organizationId
    })
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

    // 2. Revoke all refresh tokens
    await RefreshToken.deleteMany({ user: id });

    res.status(200).json({
        success: true,
        message: "User session terminated and tokens revoked successfully",
    });
});
