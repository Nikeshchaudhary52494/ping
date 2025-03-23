"use server";

import { db } from "@/lib/db";

export async function blockUser(blockedId: string, userId: string) {
    try {
        await db.contactBlock.create({
            data: {
                userId,
                blockedId,
            },
        });
        return { success: true, message: "User blocked successfully" };
    } catch (error) {
        return { success: false, message: "Failed to block the user." };
    }
}
