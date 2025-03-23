"use server"

import { db } from "@/lib/db";
import { getUser } from "../user/getUser";

export async function updatePassword(currentPassword: string, newPassword: string) {
    const { user } = await getUser();
    if (!user) throw new Error("User not found");

    // Here, implement password verification and update logic
    const existingUser = await db.user.findUnique({ where: { id: user.id } });

    if (!existingUser) throw new Error("User not found");
    if (existingUser.password !== currentPassword) throw new Error("Incorrect current password");

    await db.user.update({
        where: { id: user.id },
        data: { password: newPassword },
    });
}