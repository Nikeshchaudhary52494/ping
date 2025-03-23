"use server"

import { db } from "@/lib/db"

export default async function getGroupByChatId(chatId: string) {
    return db.groupChat.findUnique({
        where: {
            chatId
        },
        include: {
            chat: {
                include: {
                    messages: true
                }
            }
        }
    })
}