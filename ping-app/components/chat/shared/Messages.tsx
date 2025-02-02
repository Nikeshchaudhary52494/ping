"use client";

import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import { Message } from "@prisma/client";
import { useMessage } from "@/components/providers/messageProvider";
import { useSocketContext } from "@/components/providers/socketProvider";

interface MessagesProps {
    messages: Message[];
    userId: string;
    toBottom: boolean;
    setToBottom: (set: boolean) => void;
}

export default function Messages({
    userId,
    toBottom,
    messages: initialMessages,
}: MessagesProps) {

    const { socket } = useSocketContext();
    const { messages, setMessages, addMessage } = useMessage();
    const messageEndRef = useRef<HTMLDivElement | null>(null);


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
        <div
            className="flex flex-col h-full space-y-2">
            {messages && messages.map(({ content, senderId, fileUrl, status, createdAt }, index) => (
                <div
                    key={index}
                    className={`chat  ${userId === senderId ? `chat-end` : `chat-start`}`}>
                    <MessageItem
                        content={content!}
                        fileUrl={fileUrl!}
                        isMine={userId === senderId}
                        status={status}
                        createdAt={createdAt}
                    />
                </div>
            ))}
            <div ref={toBottom ? messageEndRef : null} />
        </div>
    );
}
