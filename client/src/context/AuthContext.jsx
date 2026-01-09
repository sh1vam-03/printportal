import { createContext, useEffect, useState } from "react";
import api from "../services/api";

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
            setUser({ role, name, userId: decoded?.userId || decoded?._id });
        }

        setLoading(false);
    }, []);

    const login = async (data) => {
        const res = await api.post("/auth/login", data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("name", res.data.name);

        const decoded = parseToken(res.data.token);
        setUser({ role: res.data.role, name: res.data.name, userId: decoded?.userId || decoded?._id });
    };

    const signup = async (data) => {
        // Signup is disabled but keeping function for context compatibility
        throw new Error("Signup disabled");
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
