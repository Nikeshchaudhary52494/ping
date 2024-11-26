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
        }
    });
};


const createChat = async (type: ChatType, memberIds: string[]) => {
    return await db.chat.create({
        data: {
            type,
            members: {
                connect: memberIds.map((id) => ({ id }))
            }
        }
    });
};

export const getOrCreatePrivateChatId = async (memberOne: string, memberTwo: string) => {
    try {
        const isSelfChat = memberOne === memberTwo;
        const chatType = isSelfChat ? ChatType.SELF : ChatType.PRIVATE;
        const memberIds = [memberOne, memberTwo];

        const existingChat = await findChatByTypeAndMembers(chatType, memberIds);
        if (existingChat) {
            return existingChat.id;
        }

        const newChat = await createChat(chatType, memberIds);
        return newChat.id;

    } catch (error) {
        console.error("Error fetching or creating private chat:", error);
        throw new Error("Failed to fetch or create private chat");
    }
};
