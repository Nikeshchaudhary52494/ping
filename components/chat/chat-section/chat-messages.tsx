"use client";

import { useEffect, useRef } from "react";
import MessageItem from "./message-item";
import { useSocket } from "@/components/providers/socketProvider";
import { Message } from "@prisma/client";
import { useMessage } from "@/components/providers/messageProvider";

interface ChatMessagesProps {
    messages: Message[];
    userId: string;
    chatId: string;
}

export default function ChatMessages({ userId, messages: initialMessages }: ChatMessagesProps) {
    const { socket, isConnected } = useSocket();
    const { messages, setMessages, addMessage } = useMessage();
    const messageEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (messages.length === 0) setMessages(initialMessages);

        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            addMessage(newMessage);
        });

        return () => {
            socket.off("newMessage");
        };
    }, [socket, addMessage, setMessages, initialMessages]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "instant" });
        }
    }, [messages]);

    return (
        <div className="flex flex-col space-y-2">
            {messages.map(({ content, senderId }, index) => (
                <MessageItem
                    key={index}
                    isMine={userId === senderId}
                    content={content!}
                />
            ))}
            <div ref={messageEndRef} />
        </div>
    );
}
