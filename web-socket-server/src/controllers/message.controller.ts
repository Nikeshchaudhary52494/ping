import { Request, Response } from "express";
import { db } from "../lib/db";
import { getReceiverSocketId, io } from "../socket/socket";

export const sendMessage = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { content, senderId, fileUrl, receiverId } = req.body;
        const { chatId } = req.params;

        if (!content || !senderId || !chatId) {
            return res.status(400).json({ error: "Content, senderId, and chatId are required" });
        }

        const chat = await db.chat.findUnique({
            where: { id: chatId }
        });

        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        const newMessage = await db.message.create({
            data: {
                content,
                fileUrl,
                senderId,
                chatId,
            }
        });

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ error: "Failed to send message" });
    }
};
