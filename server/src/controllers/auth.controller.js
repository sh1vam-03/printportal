import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ---------------- TEACHER SIGNUP ---------------- */
export const teacherRegister = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
        throw new ApiError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "TEACHER",
    });

    const token = generateToken(teacher.toJSON());

    res.status(201).json({
        success: true,
        message: "Teacher account created",
        token,
        role: teacher.role,
        name: teacher.name,
    });
});

/* ---------------- LOGIN (ALL ROLES) ---------------- */
export const login = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = generateToken(user.toJSON());

    res.json({
        success: true,
        message: "Login successful",
        token,
        role: user.role,
        name: user.name,
    });
});
