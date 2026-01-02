import { io } from "socket.io-client";

// Singleton socket instance
let socket;

export const initSocketConnection = () => {
    if (socket) return socket;

    socket = io("http://localhost:5000", {
        transports: ["websocket"],
        reconnection: true,
    });

    socket.on("connect", () => {
        console.log("🟢 Connected to Socket.io server", socket.id);
    });

    socket.on("disconnect", () => {
        console.log("🔴 Disconnected from Socket.io server");
    });

    return socket;
};

export const getSocket = () => {
    if (!socket) {
        return initSocketConnection();
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
