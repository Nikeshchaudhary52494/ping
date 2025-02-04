"use server"

import { db } from "@/lib/db";

export default async function getGroupSearchData() {
    try {
        const groupSearchData = await db.groupChat.findMany({
            select: {
                id: true,
                imageUrl: true,
                name: true,
            }
        });
        return groupSearchData;
    } catch (error) {
        console.log("Error getingSeacrhData", error);
    }
}