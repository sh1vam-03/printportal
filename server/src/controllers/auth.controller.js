import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import RefreshToken from "../models/RefreshToken.js";
import { ApiError } from "../utils/ApiError.js";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";


/* ---------------- REGISTER ORGANIZATION (NEW SAAS FLOW) ---------------- */
export const signupOrganization = asyncHandler(async (req, res) => {
    const { orgName, adminName, email, password, subscriptionPlan } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "Email already registered");
    }

    // 2. Create Organization
    const organization = await Organization.create({
        name: orgName,
        adminEmail: email,
        subscriptionPlan: subscriptionPlan || "STARTER"
    });

    // 3. Create Admin User linked to Organization
    const user = await User.create({
        name: adminName,
        email,
        password: await bcrypt.hash(password, 10),
        role: "ADMIN",
        organization: organization._id,
    });

    // 4. Generate Refresh Token
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await RefreshToken.create({
        token: refreshToken,
        user: user._id,
        expiresAt
    });

    // 5. Generate Access Token
    const token = generateToken({
        userId: user._id,
        role: user.role,
        organizationId: organization._id,
        tokenVersion: user.tokenVersion
    });

    res.status(201).json({
        success: true,
        message: "Organization registered successfully",
        token,
        refreshToken,
        role: user.role,
        name: user.name,
        organization: organization,
    });
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

    // Generate Refresh Token
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await RefreshToken.create({
        token: refreshToken,
        user: user._id,
        expiresAt
    });

    const token = generateToken({
        userId: user._id,
        role: user.role,
        organizationId: user.organization, // Include Org ID in token
        tokenVersion: user.tokenVersion
    });

    res.json({
        success: true,
        message: "Login successful",
        token,
        refreshToken,
        role: user.role,
        name: user.name,
    });
});

/* ---------------- REFRESH TOKEN ---------------- */
export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new ApiError(400, "Refresh Token is required");
    }

    const tokenDoc = await RefreshToken.findOne({ token: refreshToken }).populate("user");

    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = tokenDoc.user;

    // Optional: Check if user is still active/valid
    if (!user || !user.isActive) {
        throw new ApiError(403, "User account is disabled");
    }

    // Generate new Access Token
    const newAccessToken = generateToken({
        userId: user._id,
        role: user.role,
        organizationId: user.organization,
        tokenVersion: user.tokenVersion
    });

    // Optionally: Rotate Refresh Token here for extra security
    // For now, we keep the same refresh token until it expires

    res.json({
        success: true,
        token: newAccessToken,
        role: user.role,
        name: user.name
    });
});


/* ---------------- LOGOUT ---------------- */
export const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    // If refreshToken provided, delete it
    if (refreshToken) {
        await RefreshToken.deleteOne({ token: refreshToken });
    }

    // Client should verify deleting from storage
    res.json({
        success: true,
        message: "Logged out successfully"
    });
});
