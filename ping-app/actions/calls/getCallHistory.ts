"use server"

import { db } from "@/lib/db"

export default async function getCallHistory(userId: string) {
    const result = await db.callHistory.findMany({
        where: {
            OR: [
                {
                    callerId: userId,
                },
                {
                    receiverId: userId,
                },
            ],
        },
        include: {
            caller: {
                select: {
                    displayName: true,
                    username: true
                }
            },
            receiver: {
                select: {
                    displayName: true,
                    username: true
                }
            }
        }
    })

    return result;

}