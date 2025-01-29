import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import { CallService } from "../services/CallService";

dotenv.config();
const app = express();

const server = http.createServer(app);

const hostedUrl = "http://localhost:3000";

const io = new Server(server, {
    cors: {
        origin: [hostedUrl],
        methods: ["GET", "POST"],
    },
});

const userSocketMap: { [key: string]: string } = {};

// Helper function to get the receiver's socket ID
export const getReceiverSocketId = (receiverId: string): string | undefined => {
    return userSocketMap[receiverId];
};

const callService = new CallService(io, userSocketMap);

io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId as string;

    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log("Updated userSocketMap:", userSocketMap);
    }

    io.emit("users:online", Object.keys(userSocketMap));

    // Call events
    socket.on("call:initiate", (data) => callService.initiateCall(socket, data));
    socket.on("call:accept", (data) => callService.acceptCall(socket, data));
    socket.on("call:reject", (data) => callService.rejectCall(socket, data));
    socket.on("call:end", (data) => callService.endCall(socket, data));
    socket.on("call:cancel", (data) => callService.cancelCall(socket, data));

    // WebRTC signaling events
    socket.on("webrtc:offer", (data) => {
        console.log("offer called");
        const receiverSocketId = getReceiverSocketId(data.to);
        console.log(receiverSocketId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("webrtc:offer", {
                sdp: data.sdp,
                from: userId,
            });
            console.log(`Offer sent from ${userId} to ${data.to}`);
        }
    });

    socket.on("webrtc:answer", (data) => {
        console.log("answer called");
        const receiverSocketId = getReceiverSocketId(data.to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("webrtc:answer", {
                sdp: data.sdp,
                from: userId,
            });
            console.log(`Answer sent from ${userId} to ${data.to}`);
        }
    });

    socket.on("webrtc:candidate", (data) => {
        console.log("candidate called");
        const receiverSocketId = getReceiverSocketId(data.to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("webrtc:candidate", {
                candidate: data.candidate,
                from: userId,
            });
            console.log(`Candidate sent from ${userId} to ${data.to}`);
        }
    });

    socket.on("disconnect", async () => {
        console.log("User disconnected:", socket.id);
        delete userSocketMap[userId];
        io.emit("users:online", Object.keys(userSocketMap));
    });
});

export { app, io, server };
