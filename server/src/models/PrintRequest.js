import mongoose from "mongoose";

const printRequestSchema = new mongoose.Schema(
    {
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        fileUrl: {
            type: String,
            required: true,
        },

        fileType: {
            type: String, // MIME type
            required: true,
        },

        fileSize: {
            type: Number, // Bytes
            required: true,
        },

        originalName: {
            type: String,
            required: true,
        },

        copies: {
            type: Number,
            required: true,
            min: 1,
        },

        printType: {
            type: String,
            enum: ["SINGLE_SIDE", "DOUBLE_SIDE"],
            required: true,
        },

        deliveryType: {
            type: String,
            enum: ["PICKUP", "ROOM_DELIVERY"],
            required: true,
        },

        deliveryRoom: {
            type: String,
            default: null,
        },

        dueDateTime: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "APPROVED",
                "REJECTED",
                "IN_PROGRESS",
                "COMPLETED",
            ],
            default: "PENDING",
        },
    },
    {
        timestamps: true,
    }
);

const PrintRequest = mongoose.model("PrintRequest", printRequestSchema);

export default PrintRequest;
