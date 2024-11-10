"use server"

import { db } from "@/lib/db";

export const getOrCreatePrivateChatId = async (memberOne: string, memberTwo: string) => {
    try {
        const privateChat = await db.privateChat.findFirst({
            where: {
                participants: {
                    every: {
                        id: {
                            in: [memberOne, memberTwo]
                        }
                    }
                }
            }
        });

        if (privateChat) {
            return privateChat.id;
        }

        const newPrivateChat = await db.privateChat.create({
            data: {
                participants: {
                    connect: [{ id: memberOne }, { id: memberTwo }]
                }
            }
        });

        return newPrivateChat.id;
    } catch (error) {
        console.error('Error fetching or creating private chat:', error);
        throw new Error('Failed to fetch or create private chat');
    }
};