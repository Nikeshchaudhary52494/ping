"use server";

import { db } from "@/lib/db";

export default async function getUserPublicKey(userId: string) {
    const result = await db.user.findUnique({
        where: {
            id: userId
        },
        select: {
            publicKey: true,
        }
    })
    return result?.publicKey;
}