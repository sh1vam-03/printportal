import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


/* ---------------- REGISTER ORGANIZATION (NEW SAAS FLOW) ---------------- */
export const signupOrganization = asyncHandler(async (req, res) => {
    const { orgName, adminName, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "Email already registered");
    }

    // 2. Create Organization
    const organization = await Organization.create({
        name: orgName,
        adminEmail: email,
    });

    // 3. Create Admin User linked to Organization
    const user = await User.create({
        name: adminName,
        email,
        password: await bcrypt.hash(password, 10),
        role: "ADMIN",
        organization: organization._id,
    });

    // 4. Generate Token
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
        role: user.role,
        name: user.name,
    });
});
