import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        adminEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        subscriptionPlan: {
            type: String,
            enum: ["STARTER", "PROFESSIONAL", "ENTERPRISE"],
            default: "STARTER",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
