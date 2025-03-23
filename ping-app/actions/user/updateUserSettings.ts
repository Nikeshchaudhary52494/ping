"use server";

import { db } from "@/lib/db";

interface UpdateUserSettingsProps {
    showProfileImage: boolean;
    restrictMessagesFromUnknown: boolean;
    hideProfile: boolean;
    hideOnlineStatus: boolean;
}

export const updateUserSettings = async (settings: UpdateUserSettingsProps, userId: string) => {
    try {
        return await db.userSettings.update({
            where: { userId: userId },
            data: {
                showProfileImage: settings.showProfileImage,
                restrictMessagesFromUnknown: settings.restrictMessagesFromUnknown,
                hideProfile: settings.hideProfile,
                hideOnlineStatus: settings.hideOnlineStatus,
            },
        });
    } catch (error) {
        console.error("Failed to update user settings:", error);
        throw new Error("Failed to update user settings");
    }
};