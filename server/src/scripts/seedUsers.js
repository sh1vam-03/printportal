import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        const users = [
            {
                name: "System Admin",
                email: "admin@school.com",
                password: await bcrypt.hash("admin123", 10),
                role: "ADMIN",
            },
            {
                name: "Printing Staff",
                email: "printing@school.com",
                password: await bcrypt.hash("print123", 10),
                role: "PRINTING",
            },
        ];

        for (const user of users) {
            const exists = await User.findOne({ email: user.email });
            if (!exists) {
                await User.create(user);
                console.log(`Created user: ${user.email}`);
            } else {
                console.log(`User already exists: ${user.email}`);
            }
        }

        console.log("Seeding completed");
        process.exit();
    } catch (error) {
        console.error("Seeding error:", error.message);
        process.exit(1);
    }
};

seedUsers();
