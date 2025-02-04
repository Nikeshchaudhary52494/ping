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
        setMessages(initialData.messages);
    }, [initialData.messages, setMessages]);

    return (
        <div className="relative flex flex-col h-full">
            {/* Chat Header */}
            <div className="w-full h-[64px] bg-[#1E1F22]">
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
                            <Loader2 className="w-6 h-6 my-4 text-zinc-500 animate-spin" />
                        ) : (
                            <button
                                onClick={() => loadMoreMessages()}
                                className="my-4 text-xs transition text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
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
            <div className="w-full p-3 bg-[#1E1F22] sm:border-l border-slate-200 border-opacity-10">
                {chatType === "group" ? (
                    <MessageInput senderId={user?.id!} receiversId={receiversId} setToBottom={setToBottom} />
                ) : (
                    <MessageInput senderId={user?.id!} receiverId={receiver?.id} setToBottom={setToBottom} />
                )}
            </div>
        </div>
    );
}
