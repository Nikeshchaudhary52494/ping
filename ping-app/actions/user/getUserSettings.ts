"use server";

import { db } from "@/lib/db";

export const getUserSettings = async (userId: string) => {
    try {
        const settings = await db.userSettings.findUnique({
            where: { userId: userId },
        });
        return settings;
    } catch (error) {
        console.error("Failed to fetch user settings:", error);
        throw new Error("Failed to fetch user settings");
    }
};