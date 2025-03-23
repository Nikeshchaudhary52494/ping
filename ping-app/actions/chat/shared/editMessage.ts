"use server"

import { db } from "@/lib/db"

export default async function EditMessage(messageId: string, newContent: string, nonce: string) {
    return await db.message.update({
        where: {
            id: messageId
        },
        data: {
            isEdited: true,
            encryptedContent: newContent,
            nonce
        }
    })
}