import { Request, Response } from "express";
import { db } from "../lib/db";
import { getReceiverSocketId, io } from "../socket/socket";

export const sendMessage = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { encryptedContent, nonce, senderId, fileUrl, receiverId } = req.body;
        const { chatId } = req.params;

        if (!chatId || !senderId || (!encryptedContent && !fileUrl)) {
            return res.status(400).json({ error: "chatId, senderId, and either encryptedContent or fileUrl are required." });
        }

        const chat = await db.chat.findUnique({ where: { id: chatId } });
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        const newMessage = await db.message.create({
            data: {
                encryptedContent: encryptedContent || null,
                nonce: nonce || null,
                fileUrl: fileUrl || null,
                senderId,
                chatId,
                status: "SENT"
            }
        });

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
