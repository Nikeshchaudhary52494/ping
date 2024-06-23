import { auth } from '@clerk/nextjs/server';

import { db } from '@/lib/db';

export const currentProfile = async () => {
    const { userId } = auth();

    if (!userId) return null;

    const profile = await db.profile.findUnique({
        where: {
            userId,
        },
    });
    console.log("####")
    console.log("this is profile" + profile);
    return profile;
};