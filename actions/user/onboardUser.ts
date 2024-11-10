"use server"


import { db } from "@/lib/db";

interface onboardUserParams {
    userId: string
    username: string;
    displayName: string;
    bio: string;
    imageUrl?: string;
}

export async function onboardUser({ userId, displayName, username, bio, imageUrl }: onboardUserParams) {
    const newProfile = await db.user.update({
        where: {
            id: userId
        },
        data: {
            username,
            displayName,
            bio,
            imageUrl,
            onboarded: true
        }
    });

    return newProfile;
}