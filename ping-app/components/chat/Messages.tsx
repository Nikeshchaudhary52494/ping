"use client";

import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import { useMessage } from "@/components/providers/messageProvider";
import { useSocketContext } from "@/components/providers/socketProvider";
import { DecryptedMessages } from "@/types/prisma";
import { decryptPrivateMessage } from "@/lib/crypto";
import getUserPublicKey from "@/actions/user/getUserPublicKey";

interface MessagesProps {
    messages: DecryptedMessages[];
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
        socket.on("newMessage", async (newMessage) => {
            const receiverPrivateKey = localStorage.getItem("pingPrivateKey");
            const senderPublicKey = await getUserPublicKey(newMessage.senderId);
            const decryptedText = await decryptPrivateMessage(
                newMessage.encryptedContent!,
                newMessage.nonce,
                senderPublicKey!,
                receiverPrivateKey!
            );

            addMessage({ ...newMessage, content: decryptedText });
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
            className="flex flex-col h-full space-y-1">
            {messages && messages.map(({ content, senderId, fileUrl, status, createdAt, isDeleted, isEdited }, index) => {
                const isFirstMessage = index === 0 || messages[index - 1].senderId !== senderId;
                const isLastMessage = messages[index + 1]?.senderId !== senderId;
                return (
                    <div
                        key={index}
                        className={`flex ${messages.length - 1 == index && `pb-4`} ${userId === senderId ? `justify-end` : `justify-start`}`}>
                        <MessageItem
                            content={content!}
                            fileUrl={fileUrl!}
                            isMine={userId === senderId}
                            status={status}
                            createdAt={createdAt}
                            isFirstMessage={isFirstMessage}
                            isLastMessage={isLastMessage}
                            isDeleted={isDeleted}
                            isEdited={isEdited}
                        />
                    </div>
                )
            })}
            <div ref={toBottom ? messageEndRef : null} />
        </div>
    );
}
