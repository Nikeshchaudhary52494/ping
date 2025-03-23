"use server"

import { db } from "@/lib/db"

export default async function unBlockUser(userId: string, blockedId: string) {
    try {
        // Start a transaction to ensure consistency
        const [_, remainingUsers] = await db.$transaction([
            // Deleting the blocked user
            db.contactBlock.delete({
                where: { userId_blockedId: { userId, blockedId } },
            }),

            // Retrieving the remaining blocked users
            db.contactBlock.findMany({
                where: { userId },
                select: {
                    blocked: {
                        select: {
                            displayName: true,
                            id: true,
                            username: true,
                            imageUrl: true
                        }
                    }
                }
            })
        ]);

        // Return the remaining users after the unblock
        return remainingUsers;
    } catch (error) {
        console.error("Error unblocking user:", error);
        throw new Error("Failed to unblock user");
    }
}
