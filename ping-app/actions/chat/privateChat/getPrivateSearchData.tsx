"use server"

import { db } from "@/lib/db";

export default async function getPrivateSearchData() {
    try {
        const searchData = await db.user.findMany({
            select: {
                id: true,
                imageUrl: true,
                displayName: true,
                username: true,
            }
        });
        return searchData;
    } catch (error) {
        console.log("Error getingSeacrhData", error);
    }
}