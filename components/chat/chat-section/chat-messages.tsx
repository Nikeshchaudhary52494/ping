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
    console.log(initialMessages);
    useEffect(() => {
        setMessages(initialMessages);
    }, [setMessages, initialMessages])

    useEffect(() => {
        if (!socket) return;
        socket.on("newMessage", (newMessage) => {
            addMessage(newMessage);
        });
        return () => {
            socket.off("newMessage");
        };
    }, [socket, addMessage]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "instant" });
        }
    }, [messages]);

    return (
        <div className="flex flex-col space-y-2">
            {messages && messages.map(({ content, senderId, fileUrl }, index) => (
                <div className={`chat  ${userId === senderId ? `chat-end` : `chat-start`}`}>
                    <MessageItem
                        key={index}
                        content={content!}
                        fileUrl={fileUrl!}
                        isMine={userId === senderId}
                    />
                </div>
            ))}
            <div ref={messageEndRef} />
        </div>
    );
}
