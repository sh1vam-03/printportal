import express from "express";
import cors from "cors";
import indexRoutes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";


const app = express();

/* ---------------- Middlewares ---------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

/* ---------------- Health Check ---------------- */
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Printing Management API is running",
    });
});

/* ---------------- Routes ---------------- */
app.use("/api", indexRoutes);

// Global 404 Handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

export default app;
