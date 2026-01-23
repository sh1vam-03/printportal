import mongoose from "mongoose";

// Configure Mongoose
mongoose.set("strictQuery", true);

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");
    } catch (error) {
        console.error("❌ MongoDB error:", error.message);
        process.exit(1);
    }
};
