"use server"

import { db } from "@/lib/db";
import { ChatType } from "@prisma/client";

interface createGroupParams {
    ownerId: string
    name: string;
    about: string;
    imageUrl?: string;
}

export async function createGroup({ about, name, ownerId, imageUrl }: createGroupParams) {
    const newGroup = await db.chat.create({
        data: {
            type: ChatType.GROUP,
            groupChat: {
                create: {
                    about,
                    name,
                    ownerId,
                    imageUrl,
                    members: {
                        connect: [{ id: ownerId }]
                    },
                    admins: {
                        connect: [{ id: ownerId }]
                    }
                },
            },
        },
        select: {
            groupChat: {
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
            }
        }
    });

    return newGroup;
}