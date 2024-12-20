"use client";

import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import { Message } from "@prisma/client";
import { useMessage } from "@/components/providers/messageProvider";
import { useSocketContext } from "@/components/providers/socketProvider";

interface MessagesProps {
    messages: Message[];
    userId: string;
    chatId: string;
}

export default function Messages({
    userId, messages: initialMessages
}: MessagesProps) {

    const { currentCall } = useSocketContext();
    const { socket, isConnected } = useSocketContext();
    const { messages, setMessages, addMessage } = useMessage();
    const messageEndRef = useRef<HTMLDivElement | null>(null);

    console.log(currentCall);
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
                <div
                    key={index}
                    className={`chat  ${userId === senderId ? `chat-end` : `chat-start`}`}>
                    <MessageItem
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
