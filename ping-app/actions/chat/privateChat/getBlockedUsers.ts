"use server";

import { db } from "@/lib/db";

export default async function getBlockedUsers(userId: string) {
    const blockedUsers = await db.user.findUnique({
        where: {
            id: userId
        },
        select: {
            blockedContacts: {
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
            }
        }
    });
    return blockedUsers?.blockedContacts;
}