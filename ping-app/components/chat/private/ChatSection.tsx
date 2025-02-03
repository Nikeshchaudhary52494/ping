"use client";

import { useEffect, useRef } from "react";
import { Message, User } from "@prisma/client";
import MessageInput from "../shared/MessageInput";
import ChatMessages from "../shared/Messages";
import SectionHeader from "./SectionHeader";
import { useUser } from "@/components/providers/userProvider";
import { useMessage } from "@/components/providers/messageProvider";
import { Loader2 } from "lucide-react";
import useChatScroll from "@/app/hooks/useChatScroll";
import ChatWelcome from "../shared/ChatWelcome";

interface ChatSectionProps {
    params: {
        privateChatId: string;
    };
    initialData: {
        messages: Message[];
        nextCursor: string | null;
    };
    members: User[];
}

export default function ChatSection({
    params,
    initialData,
    members,
}: ChatSectionProps) {

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const { user } = useUser();
    const receiver = members.find((member) => member.id !== user?.id)
    const { messages, setMessages } = useMessage();

    const { toBottom, isLoading, loadMoreMessages, hasNextMessage, setToBottom }
        = useChatScroll({
            nextCursor: initialData.nextCursor,
            scrollContainerRef, setMessages,
            privateChatId: params.privateChatId
        })

    useEffect(() => {
        setMessages(initialData.messages);
    }, [initialData.messages, setMessages]);

    return (
        <div className="relative flex flex-col h-full">
            <div className="w-full h-[64px] bg-[#1E1F22]">
                <SectionHeader receiver={receiver!} CurrectUser={user!} />
            </div>
            <div
                ref={scrollContainerRef}
                className="flex flex-col flex-1 p-2 overflow-y-scroll"
            >
                {!hasNextMessage && <ChatWelcome name={receiver?.displayName!} type="private" />}
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
            <div className="w-full p-3 bg-[#1E1F22] sm:border-l border-slate-200 border-opacity-10">
                <MessageInput
                    senderId={user?.id!}
                    receiverId={receiver?.id}
                    setToBottom={setToBottom}
                />
            </div>
        </div>
    );
}
