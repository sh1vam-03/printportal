import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";

import app from "./app.js";
import { initSocket } from "./config/socket.js";

dotenv.config();

/* ---------------- Environment ---------------- */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

/* ---------------- Create HTTP Server ---------------- */
const server = http.createServer(app);

/* ---------------- Socket.io Init ---------------- */
initSocket(server);

/* ---------------- MongoDB Connection ---------------- */
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");

        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
    });
