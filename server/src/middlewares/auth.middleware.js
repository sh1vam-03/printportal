import jwt from "jsonwebtoken";

export const requireRole = (roles) => {
    return (req, res, next) => {
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

            req.user = decoded; // { userId, role }
            next();
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
    };
};
