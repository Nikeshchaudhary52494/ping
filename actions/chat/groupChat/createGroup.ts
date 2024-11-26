"use server"


import { db } from "@/lib/db";
import { ChatType } from "@prisma/client";

interface createGroupParams {
    ownerId: string
    name: string;
    about: string;
    imageUrl?: string;
}

export async function createGroup({ about, name, ownerId, imageUrl }: createGroupParams) {
    const newGroup = await db.chat.create({
        data: {
            type: ChatType.GROUP,
            groupChat: {
                create: {
                    about,
                    name,
                    ownerId,
                    imageUrl,
                    members: {
                        connect: [{ id: ownerId }]
                    },
                    admins: {
                        connect: [{ id: ownerId }]
                    }
                },
            },
        }
    });

    return newGroup;
}