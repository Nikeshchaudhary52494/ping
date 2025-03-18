"use server"


import { db } from "@/lib/db";
import { ChatType } from "@prisma/client";

interface createGroupParams {
    ownerId: string
    name: string;
    about: string;
    imageUrl?: string;
    encryptedKey: string,
    nonce: string,
}

export async function createGroup({ about, name, ownerId, imageUrl, encryptedKey, nonce }: createGroupParams) {
    const newGroup = await db.chat.create({
        data: {
            type: ChatType.GROUP,
            groupChat: {
                create: {
                    about,
                    name,
                    ownerId,
                    imageUrl,
                    encryptedKey,
                    nonce,
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