"use server";

import { db } from "@/lib/db";

interface GetPaginatedMessagesProps {
    privateChatId?: string;
    groupChatId?: string;
    cursor?: string;
}

export async function getPaginatedMessages({
    privateChatId,
    groupChatId,
    cursor
}: GetPaginatedMessagesProps) {
    const pageSize = 20;

    const messages = await db.message.findMany({
        where: { chatId: privateChatId || groupChatId },
        orderBy: { createdAt: "desc" },
        take: pageSize,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0,
    });

    return {
        messages: messages.reverse(),
        nextCursor: messages.length > 0 ? messages[0].id : null,
    };
}
