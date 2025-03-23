"use server";

import { db } from "@/lib/db";

export default async function getGroupOrAddMember(chatId: string, userId: string) {
    const isUserMember = await db.user.findUnique({
        where: { id: userId },
        select: {
            groupMemberships: {
                select: {
                    chatId: true
                }
            }
        }
    });

    if (!isUserMember?.groupMemberships.some(membership => membership.chatId === chatId)) {
        await db.groupChat.update({
            where: {
                chatId
            },
            data: {
                members: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
    }

    const group = await db.groupChat.findUnique({
        where: { chatId },
        select: {
            imageUrl: true,
            name: true,
            id: true,
            chat: {
                select: {
                    id: true,
                    messages: {
                        select: {
                            fileUrl: true,
                            encryptedContent: true,
                            createdAt: true,
                            updatedAt: true,
                            isDeleted: true
                        },
                        take: 1,
                        orderBy: { createdAt: "desc" }
                    }
                }
            }
        }
    });

    return group;
}
