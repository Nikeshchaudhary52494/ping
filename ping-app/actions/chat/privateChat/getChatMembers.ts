"use server"

import { db } from "@/lib/db";

export async function getChatMembers(privateChatId: string) {
    try {
        const chatMembers = await db.chat.findUnique({
            where: { id: privateChatId },
            select: { members: true },
        });
        return chatMembers;

    } catch (error) {
        console.log("Error geting ChatMembers", error);
    }
}
