"use server"

import { db } from "@/lib/db";

export async function addMembersToGroup(groupId: string, userIds: string[]) {
    return await db.groupChat.update({
        where: { chatId: groupId },
        data: {
            members: {
                connect: userIds.map((id) => ({ id }))
            }
        }
    });
}

export async function searchUsers(query: string) {
    return await db.user.findMany({
        where: {
            OR: [
                { displayName: { contains: query, mode: "insensitive" } },
                { username: { contains: query, mode: "insensitive" } }
            ]
        },
        select: {
            id: true,
            displayName: true,
            username: true,
            imageUrl: true
        }
    });
}