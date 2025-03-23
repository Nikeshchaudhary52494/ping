"use server";

import { db } from "@/lib/db";
import { getUser } from "./getUser";

export async function updateDisplayName(newName: string) {
    const { user } = await getUser();
    if (!user) throw new Error("User not found");

    await db.user.update({
        where: {
            id: user.id
        },
        data: {
            displayName: newName
        },
    });
}