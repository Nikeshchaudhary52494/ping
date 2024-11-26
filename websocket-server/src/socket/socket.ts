import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const server = http.createServer(app);

const hostedUrl = "http://localhost:3000"

const io = new Server(server, {
    cors: {
        origin: [`${hostedUrl}`],
        methods: ["GET", "POST"],
    },
});

const userSocketMap: { [key: string]: string } = {};

export const getReceiverSocketId = (receiverId: string): string | undefined => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId as string;

    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log("Updated userSocketMap:", userSocketMap);
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", async () => {
        console.log("User disconnected:", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
