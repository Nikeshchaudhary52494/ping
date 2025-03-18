"use server"

import { db } from "@/lib/db"

export default async function getUserGroups(userId: string) {
    try {
        const userGroups = await db.groupChat.findMany({
            where: {
                members: {
                    some: {
                        id: userId
                    }
                }
            },
            select: {
                id: true,
                imageUrl: true,
                name: true,
                chat: {
                    select: {
                        id: true,
                        messages: {
                            take: 1,
                            orderBy: { createdAt: "desc" },
                            select: {
                                nonce: true,
                                encryptedContent: true,
                                fileUrl: true,
                                createdAt: true,
                                isDeleted: true,
                                updatedAt: true
                            }
                        }
                    }
                }
            }
        })
        return userGroups;
    } catch (error) {
        console.error("Error getting UserGroup", error);
    }
}