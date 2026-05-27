"use client";

import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import { useMessage } from "@/components/providers/messageProvider";
import { useSocketContext } from "@/components/providers/socketProvider";
import { useChatData } from "@/components/providers/chatDataProvider";
import { DecryptedMessages } from "@/types/prisma";
import { decryptPrivateMessage } from "@/lib/crypto";
import getUserPublicKey from "@/lib/getUserPublicKeyClient";

interface MessagesProps {
    messages: DecryptedMessages[];
    userId: string;
    toBottom: boolean;
    setToBottom: (set: boolean) => void;
    setReplying: (value: boolean) => void;
    SetReplyingMessage: (value: string) => void;
    reciverId?: string;
    isGroup?: boolean;
    members?: {
        imageUrl: string | null;
        id: string;
        username: string | null;
        displayName: string;
    }[];
}

export default function Messages({
    userId,
    toBottom,
    messages: initialMessages,
    setReplying,
    SetReplyingMessage,
    reciverId,
    isGroup = false,
    members = []
}: MessagesProps) {

    const { socket } = useSocketContext();
    const { messages, setMessages, addMessage } = useMessage();
    const { updateChatLastMessage } = useChatData();
    const messageEndRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        setMessages(initialMessages);
    }, [setMessages, initialMessages])

    useEffect(() => {
        if (!socket) return;
        socket.on("newMessage", async (newMessage) => {
            const receiverPrivateKey = localStorage.getItem("pingPrivateKey");
            const senderPublicKey = await getUserPublicKey(newMessage.senderId);
            let decryptedText;

            isGroup ?
                decryptedText = newMessage.encryptedContent! :
                decryptedText = await decryptPrivateMessage(
                    newMessage.encryptedContent!,
                    newMessage.nonce,
                    senderPublicKey!,
                    receiverPrivateKey!
                );

            addMessage({ ...newMessage, content: decryptedText });
            updateChatLastMessage(newMessage.chatId, newMessage);
        });

        socket.on("message:delete", (data) => {
            setMessages((prev) => prev.map(msg => msg.id === data.messageId ? { ...msg, isDeleted: true } : msg));
        });

        socket.on("message:edit", (data) => {
            setMessages((prev) => prev.map(msg => msg.id === data.messageId ? { ...msg, isEdited: true, content: data.newContent } : msg));
        });

        return () => {
            socket.off("newMessage");
            socket.off("message:delete");
            socket.off("message:edit");
        };
    }, [socket, addMessage, isGroup, updateChatLastMessage]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "instant" });
        }
    }, [messages]);

    return (
        <div
            className="flex flex-col h-full space-y-1">
            {messages && messages.map(({ id, content, senderId, fileUrl, status, createdAt, isDeleted, isEdited }, index) => {
                const isFirstMessage = index === 0 || messages[index - 1].senderId !== senderId;
                const isLastMessage = messages[index + 1]?.senderId !== senderId;
                return (
                    <div
                        key={index}
                        className={`flex ${messages.length - 1 == index && `pb-4`} ${userId === senderId ? `justify-end` : `justify-start`}`}>
                        <MessageItem
                            messageId={id}
                            content={content!}
                            fileUrl={fileUrl!}
                            isMine={userId === senderId}
                            status={status}
                            createdAt={createdAt}
                            isFirstMessage={isFirstMessage}
                            isLastMessage={isLastMessage}
                            isDeleted={isDeleted}
                            isEdited={isEdited}
                            SetReplyingMessage={SetReplyingMessage}
                            setReplying={setReplying}
                            receiverId={reciverId}
                            isGroup={isGroup}
                            sender={members?.find(m => m.id === senderId)}
                        />
                    </div>
                )
            })}
            <div ref={toBottom ? messageEndRef : null} />
        </div>
    );
}
