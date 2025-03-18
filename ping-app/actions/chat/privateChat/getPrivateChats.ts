"use server"

import { db } from "@/lib/db";

export const getPrivateChats = async (userId: string) => {
    try {
        const privateChats = await db.chat.findMany({
            where: {
                type: { in: ["PRIVATE", "SELF"] },
                members: {
                    some: {
                        id: userId
                    }
                }
            },
            select: {
                type: true,
                id: true,
                members: {
                    where: {
                        id: { not: userId }
                    },
                    select: {
                        id: true,
                        displayName: true,
                        imageUrl: true,
                    }
                },
                messages: {
                    select: {
                        status: true,
                        fileUrl: true,
                        encryptedContent: true,
                        nonce: true,
                        createdAt: true,
                        updatedAt: true,
                        isDeleted: true
                    },
                    take: 1,
                    orderBy: { createdAt: "desc" }
                }
            },
        });

        return privateChats;
    } catch (error) {
        console.error('Error fetching private chats:', error);
        throw new Error('Failed to fetch private chats');
    }
};
