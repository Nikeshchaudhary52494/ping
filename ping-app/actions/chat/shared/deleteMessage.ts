"use server"

import { db } from "@/lib/db"

export default async function deleteMessage(messageId: string) {
    return await db.message.update({
        where: {
            id: messageId
        },
        data: {
            isDeleted: true,
            encryptedContent: null
        }
    })
}