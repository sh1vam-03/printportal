import axios from "axios";

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Add Interceptor to add Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add Interceptor to handle 401 and Refresh Token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    throw new Error("No refresh token");
                }

                // Call refresh endpoint
                // Note: Use a new axios instance to avoid infinite loops if this fails
                const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/refresh-token`, {
                    refreshToken
                });

                if (res.data.success) {
                    const newToken = res.data.token;
                    localStorage.setItem("token", newToken);

                    // Update header and retry original request
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed (expired or invalid)
                localStorage.clear();
                window.location.href = "/login"; // Force redirect to login
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
