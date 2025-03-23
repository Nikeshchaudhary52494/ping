"use server";

import { db } from "@/lib/db";
import { ChatType } from "@prisma/client";


const findChatByTypeAndMembers = async (type: ChatType, memberIds: string[]) => {
    return await db.chat.findFirst({
        where: {
            type,
            members: {
                every: {
                    id: {
                        in: memberIds
                    }
                }
            }
        },
        select: {
            type: true,
            id: true,
            members: {
                where: {
                    id: { not: memberIds[0] }
                },
                select: {
                    id: true,
                    displayName: true,
                    imageUrl: true,
                    settings: {
                        select: {
                            showProfileImage: true,
                            hideProfile: true,
                            hideOnlineStatus: true,
                        }
                    }
                },
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
};


const createChat = async (type: ChatType, memberIds: string[]) => {
    return await db.chat.create({
        data: {
            type,
            members: {
                connect: memberIds.map((id) => ({ id }))
            },
        },
        select: {
            type: true,
            id: true,
            members: {
                where: {
                    id: { not: memberIds[0] }
                },
                select: {
                    id: true,
                    displayName: true,
                    imageUrl: true,
                    settings: {
                        select: {
                            showProfileImage: true,
                            hideProfile: true,
                            hideOnlineStatus: true,
                        }
                    }
                },
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
        }
    });
};

export const getOrCreatePrivateChat = async (memberOne: string, memberTwo: string) => {
    try {
        const isSelfChat = memberOne === memberTwo;
        const chatType = isSelfChat ? ChatType.SELF : ChatType.PRIVATE;
        const memberIds = [memberOne, memberTwo];

        const existingChat = await findChatByTypeAndMembers(chatType, memberIds);
        if (existingChat) {
            return existingChat;
        }

        const newChat = await createChat(chatType, memberIds);
        return newChat;

    } catch (error) {
        console.error("Error fetching or creating private chat:", error);
        throw new Error("Failed to fetch or create private chat");
    }
};
