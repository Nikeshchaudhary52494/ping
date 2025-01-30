import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { app, server } from "./socket/socket";

import messageRoutes from "./routes/message.routes";

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());
const allowedOrigins = [
    "http://localhost:3000",
    "https://ping-messenger.vercel.app"
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.json({ message: "Ping web-socket server" });
});

app.use("/api/message", messageRoutes);

server.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`);
});
