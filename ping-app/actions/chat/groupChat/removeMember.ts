"use server";

import { db } from "@/lib/db";

export async function removeMemberFromGroup(groupId: string, userId: string) {
    return await db.groupChat.update({
        where: { chatId: groupId },
        data: {
            members: {
                disconnect: { id: userId }
            }
        }
    });
}

