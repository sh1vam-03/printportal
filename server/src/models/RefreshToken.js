import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d' // Auto-delete doc after 7 days (should match expiry)
    }
});

// Calculate expireAt based on config if needed, but usually we set it explicitly
// The 'expires' option on createdAt is a fallback mongo TTL

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
