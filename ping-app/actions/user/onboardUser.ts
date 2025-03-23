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
    try {
        const isUsernameTaken = await db.user.count({
            where: {
                username,
                id: {
                    not: userId
                }
            }
        })

        if (isUsernameTaken > 0) {
            throw new Error("Username already takne");
        }

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
    } catch (error) {
        console.error(error)
    }
}