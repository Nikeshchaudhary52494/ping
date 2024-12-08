"use server";

import { db } from "@/lib/db";


export async function getUserById(userId: string) {
    try {
        const user = await db.user.findUnique({
            where: { id: userId },
        });
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}
