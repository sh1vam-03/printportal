import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireRole = (roles) => {
    return async (req, res, next) => {
        // Skip auth for OPTIONS (CORS preflight)
        if (req.method === "OPTIONS") {
            return next();
        }

        console.log(`Auth Middleware: ${req.method} ${req.originalUrl}`);

        let token;

        // 1. Try Authorization Header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        // 2. Try Query Parameter (For file previews/downloads where headers can't be set)
        else if (req.query.token) {
            token = req.query.token;
        }

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Access denied" });
            }

            // Verify session against DB
            const user = await User.findById(decoded.userId);

            if (!user || !user.isActive) {
                return res.status(401).json({ message: "Session expired or account disabled" });
            }

            if (decoded.tokenVersion !== user.tokenVersion) {
                return res.status(401).json({ message: "Session terminated. Please login again." });
            }

            // Attach user info to request, blending token data with fresh DB data
            req.user = {
                userId: decoded.userId,
                role: decoded.role,
                tokenVersion: decoded.tokenVersion,
                organizationId: user.organization ? user.organization.toString() : null
            };
            next();

        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
    };
};
