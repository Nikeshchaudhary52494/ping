"use server"

import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwtUtils";

export const getUser = async () => {
    const data = verifyToken();

    try {
        const user = await db.user.findUnique({
            where: {
                id: data?.userId
            },
            include: {
                settings: {
                    select: {
                        hideOnlineStatus: true,
                        hideProfile: true,
                        showProfileImage: true,
                        restrictMessagesFromUnknown: true
                    }
                }
            }
        });

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        return { success: true, user };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Invalid token or error fetching user' };
    }
};