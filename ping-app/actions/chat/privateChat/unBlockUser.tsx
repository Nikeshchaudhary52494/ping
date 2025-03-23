"use server"

import { db } from "@/lib/db"

export default async function unBlockUser(userId: string, blockedId: string) {
    await db.contactBlock.delete({
        where: { userId_blockedId: { userId, blockedId } },
    })
}