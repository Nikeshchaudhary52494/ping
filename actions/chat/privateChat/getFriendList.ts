"use server"

import { db } from "@/lib/db";

export const getFriendList = async (userId: string) => {
    try {
        return await db.user.findFirst({
            where: {
                id: userId
            },
            include: {
                chats: {
                    include: {
                        members: {
                            where: {
                                id: {
                                    not: userId
                                }
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error getting friends list:', error);
        throw new Error('Failed to get friends list');
    }
}
