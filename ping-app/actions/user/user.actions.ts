"use server"


import { db } from "@/lib/db";

// export const fetchUser = async (userId: string) => {
//     return db.profile.findUnique({
//         where: { userId }
//     })
// }

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    imageUrl: string;
}

// export async function initialProfile({ name, username, bio, imageUrl, userId }: Params) {

//     const newProfile = await db.profile.create({
//         data: {
//             name,
//             username,
//             userId,
//             bio,
//             imageUrl,
//             onboarded: true
//         },
//     });

//     return newProfile;
// }