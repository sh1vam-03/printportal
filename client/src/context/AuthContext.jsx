import { createContext, useEffect, useState } from "react";
import { createContext, useEffect, useState } from "react";
import api from "../services/api";
import { joinOrg, getSocket } from "../services/socket";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helper to decode JWT payload safely
    const parseToken = (token) => {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Failed to parse token", e);
            return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const name = localStorage.getItem("name");

        if (token && role) {
            const decoded = parseToken(token);
            // Payload uses 'userId' key
            const userData = {
                role,
                name,
                userId: decoded?.userId || decoded?._id,
                organizationId: decoded?.organizationId
            };
            setUser(userData);

            // Connect socket and join org room
            getSocket();
            if (decoded?.organizationId) {
                joinOrg(decoded.organizationId);
            }
        }

        setLoading(false);
    }, []);

    const login = async (data) => {
        const res = await api.post("/auth/login", data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("name", res.data.name);

        const decoded = parseToken(res.data.token);
        const userData = {
            role: res.data.role,
            name: res.data.name,
            userId: decoded?.userId || decoded?._id,
            organizationId: decoded?.organizationId
        };
        setUser(userData);

        // Connect socket
        getSocket();
        if (decoded?.organizationId) {
            joinOrg(decoded.organizationId);
        }
    };

    const signup = async (data) => {
        const res = await api.post("/auth/signup-org", data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("name", res.data.name);

        const decoded = parseToken(res.data.token);
        const userData = {
            role: res.data.role,
            name: res.data.name,
            userId: decoded?.userId || decoded?._id,
            organizationId: decoded?.organizationId
        };
        setUser(userData);

        getSocket();
        if (decoded?.organizationId) {
            joinOrg(decoded.organizationId);
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
