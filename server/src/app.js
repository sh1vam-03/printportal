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

/* ---------------- Routes (will add later) ---------------- */
app.use("/api", indexRoutes);

export default app;
