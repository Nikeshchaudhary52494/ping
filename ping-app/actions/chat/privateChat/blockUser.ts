"use server";

import { db } from "@/lib/db";

export async function blockUser(blockedId: string, userId: string) {
    console.log("ima called")
    try {
        await db.contactBlock.create({
            data: {
                userId,
                blockedId,
            },
        });
        console.log("hello");
        return { success: true, message: "User blocked successfully" };
    } catch (error) {
        return { success: false, message: "Failed to block the user." };
    }
}
