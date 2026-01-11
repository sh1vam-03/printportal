import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireRole = (roles) => {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

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
