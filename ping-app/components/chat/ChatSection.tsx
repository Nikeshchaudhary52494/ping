"use client";

import { useEffect, useRef } from "react";
import { Message, User } from "@prisma/client";
import MessageInput from "./MessageInput";
import ChatMessages from "./Messages";
import { useUser } from "@/components/providers/userProvider";
import { useMessage } from "@/components/providers/messageProvider";
import { Loader2 } from "lucide-react";
import useChatScroll from "@/app/hooks/useChatScroll";
import ChatWelcome from "./ChatWelcome";
import ChatHeader from "./ChatHeader";
import { GroupChatData } from "@/types/prisma";
import getUserPublicKey from "@/actions/user/getUserPublicKey";
import { decrypGrouptMessage, decryptGroupKey, decryptPrivateMessage } from "@/lib/crypto";

interface ChatSectionProps {
    initialData: {
        messages: Message[];
        nextCursor: string | null;
    };
    chatType: "private" | "group";
    members?: User[]; // Only for private chat
    groupChatData?: GroupChatData; // Only for group chat
    privateChatId?: string; // Only for private chat
}

export default function ChatSection({
    initialData,
    chatType,
    members,
    groupChatData,
    privateChatId,
}: ChatSectionProps) {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const { user } = useUser();
    const { messages, setMessages } = useMessage();

    const receiver = chatType === "private"
        ? members?.find((member) => member.id !== user?.id)
        : null;

    const receiversId = chatType === "group"
        ? groupChatData?.members.filter((member) => member.id !== user?.id)
        : [];

    const { toBottom, isLoading, loadMoreMessages, hasNextMessage, setToBottom }
        = useChatScroll({
            nextCursor: initialData.nextCursor,
            scrollContainerRef,
            setMessages,
            privateChatId: privateChatId ?? groupChatData?.chatId!,
        });

    useEffect(() => {
        if (!user) return;

        async function setDecryptedMessages() {
            const currentUserPrivateKey = localStorage.getItem("pingPrivateKey");
            const currentUserPublicKey = localStorage.getItem("pingPublicKey");

            if (!currentUserPrivateKey || !currentUserPublicKey) {
                console.error("No key pair found in local storage for current user.");
                return;
            }

            let decryptedChats;
            if (chatType == "private") {
                decryptedChats = await Promise.all(
                    initialData.messages.map(async (msg) => {
                        const receiverPublicKey = await getUserPublicKey(receiver?.id!);

                        if (!receiverPublicKey) {
                            console.error(`Failed to fetch public key for user ${msg.senderId}`);
                            return { ...msg, content: null };
                        }
                        let decryptedText;

                        if (msg.senderId === user?.id) {
                            decryptedText = await decryptPrivateMessage(
                                msg.encryptedContent!,
                                msg.nonce,
                                receiverPublicKey,
                                currentUserPrivateKey,
                            );
                        } else {
                            decryptedText = await decryptPrivateMessage(
                                msg.encryptedContent!,
                                msg.nonce,
                                receiverPublicKey,
                                currentUserPrivateKey
                            );
                        }
                        return { ...msg, content: decryptedText };
                    })
                );
            } else {
                decryptedChats = await Promise.all(
                    initialData.messages.map(async (msg) => {
                        const ownerPublicKey = await getUserPublicKey(groupChatData?.ownerId!);
                        const groupKey = await decryptGroupKey(groupChatData?.encryptedKey!, groupChatData?.nonce!, currentUserPrivateKey, ownerPublicKey!)
                        const decryptedText = await decrypGrouptMessage(msg.encryptedContent!, msg.nonce, groupKey);

                        return { ...msg, content: decryptedText };
                    })
                );
            }

            setMessages(decryptedChats);
        }

        setDecryptedMessages();
    }, [initialData.messages, user?.id]);

    return (
        <div className="relative flex flex-col h-full">
            {/* Chat Header */}
            <div className="w-full h-[64px]">
                {chatType === "group" ? (
                    <ChatHeader
                        name={groupChatData!.name}
                        imageUrl={groupChatData!.imageUrl!}
                        isGroupChat={true}
                    />
                ) : (
                    <ChatHeader currentUser={user!} receiver={receiver!} />
                )}
            </div>

            {/* Messages */}
            <div ref={scrollContainerRef} className="flex flex-col flex-1 p-2 overflow-y-scroll">
                {!hasNextMessage && (
                    <ChatWelcome
                        name={chatType === "group" ? groupChatData!.name : receiver?.displayName! || user?.displayName!}
                        type={chatType}
                    />
                )}
                {hasNextMessage && (
                    <div className="flex justify-center">
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 my-4 text-primary animate-spin" />
                        ) : (
                            <button
                                onClick={() => loadMoreMessages()}
                                className="my-4 text-xs"
                            >
                                Load previous messages
                            </button>
                        )}
                    </div>
                )}
                <ChatMessages
                    messages={messages}
                    userId={user?.id!}
                    toBottom={toBottom}
                    setToBottom={setToBottom}
                />
            </div>

            {/* Message Input */}
            <div className="w-full p-3 bg-secondary sm:border-l border-secondary-foreground/10">
                {chatType === "group" ? (
                    <MessageInput
                        senderId={user?.id!}
                        receiversId={receiversId}
                        setToBottom={setToBottom}
                        isGroup={true}
                        ownerId={groupChatData?.ownerId}
                        nonce={groupChatData?.nonce}
                        encryptedGroupKey={groupChatData?.encryptedKey}
                    />
                ) : (
                    <MessageInput senderId={user?.id!} receiverId={receiver?.id} setToBottom={setToBottom} />
                )}
            </div>
        </div>
    );
}
