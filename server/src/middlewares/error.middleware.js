export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error("SERVER ERROR:", err); // Debug log

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};
