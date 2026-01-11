import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("🟢 Client connected:", socket.id);

        // Client sends "join_org" event with their orgId
        socket.on("join_org", (orgId) => {
            if (orgId) {
                socket.join(orgId);
                console.log(`Socket ${socket.id} joined room: ${orgId}`);
            }
        });

        socket.on("disconnect", () => {
            console.log("🔴 Client disconnected:", socket.id);
        });
    });
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
