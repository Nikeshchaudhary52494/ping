"use client"

import { getPaginatedMessages } from "@/actions/chat/shared/getPaginatedMessages";
import { DecryptedMessages } from "@/types/prisma";
import { MutableRefObject, useCallback, useEffect, useState } from "react";

interface UseChatScrollProps {
    scrollContainerRef: MutableRefObject<HTMLDivElement | null>;
    nextCursor: string | null;
    privateChatId?: string;
    setMessages: (messages: DecryptedMessages[]) => void;
    decryptMessages?: (messages: any[]) => Promise<any[]>;
}

export default function useChatScroll({
    scrollContainerRef,
    nextCursor,
    privateChatId,
    setMessages,
    decryptMessages
}: UseChatScrollProps) {

    const [isLoading, setIsLoading] = useState(false);
    const [cursor, setCursor] = useState<string | null>(nextCursor);
    const [toBottom, setToBottom] = useState(true);

    const hasNextMessage = cursor != null;

    /**
  * Loads more messages and adjusts the scroll position to prevent jumpiness.
  * This function fetches paginated messages based on the current cursor
  * and appends them to the message list.
  *
  * Scroll position is adjusted so that the user's view remains stable after loading new messages.
  *
  */
    const loadMoreMessages = useCallback(async () => {
        if (!cursor || isLoading) return;

        const container = scrollContainerRef.current;
        if (!container) return;

        // Store previous scroll positions
        const previousScrollHeight = container.scrollHeight;
        const previousScrollTop = container.scrollTop;

        setIsLoading(true);
        try {
            // Fetch new messages
            const newData = await getPaginatedMessages({
                privateChatId: privateChatId,
                cursor,
            });

            let finalMessages = newData.messages;
            if (decryptMessages) {
                finalMessages = await decryptMessages(newData.messages);
            }

            // Save to IndexedDB
            import("@/lib/indexedDB").then(({ idbMessages }) => {
                idbMessages.putBulk(finalMessages as any);
            });

            // Append new messages at the top
            // @ts-ignore
            setMessages((prev) => [...finalMessages, ...prev]);

            // Update cursor for next pagination
            setCursor(newData.nextCursor);

            // Adjust scroll to prevent jumping
            requestAnimationFrame(() => {
                const newScrollHeight = container.scrollHeight;
                container.scrollTop = newScrollHeight - previousScrollHeight + previousScrollTop;
            });
        } catch (error) {
            console.error("Failed to load more messages:", error);
        } finally {
            setIsLoading(false);
        }
    }, [cursor, isLoading, privateChatId, setMessages]);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const handleScroll = () => {
            if (scrollContainer.scrollTop <= 20) {
                loadMoreMessages();
                setToBottom(false);
            }
        };

        scrollContainer.addEventListener("scroll", handleScroll);

        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll);
        };
    }, [loadMoreMessages, scrollContainerRef]);

    return { toBottom, isLoading, loadMoreMessages, hasNextMessage, setToBottom };
}