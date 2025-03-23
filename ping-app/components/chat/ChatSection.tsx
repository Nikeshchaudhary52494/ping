"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "@prisma/client";
import MessageInput from "./MessageInput";
import ChatMessages from "./Messages";
import { useUser } from "@/components/providers/userProvider";
import { useMessage } from "@/components/providers/messageProvider";
import { Loader2 } from "lucide-react";
import useChatScroll from "@/app/hooks/useChatScroll";
import ChatWelcome from "./ChatWelcome";
import ChatHeader from "./ChatHeader";
import { GroupChatData, MyUser } from "@/types/prisma";
import getUserPublicKey from "@/actions/user/getUserPublicKey";
import { decryptPrivateMessage } from "@/lib/crypto";
import { GroupDetails } from "./groupDetails";
import { UserDetails } from "./userDetails";


interface ChatSectionProps {
    initialData: {
        messages: Message[];
        nextCursor: string | null;
    };
    chatType: "private" | "group";
    members?: MyUser[];
    groupChatData?: GroupChatData;
    privateChatId?: string;
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
    const [showDetails, SetShowDetails] = useState(false);
    const [replying, setReplying] = useState(false);
    const [replyingMessage, setReplingMessage] = useState("");


    const receiver = chatType === "private"
        ? members?.find((member) => member.id !== user?.id)
        : null;

    const receiversId = chatType === "group"
        ? groupChatData?.members
            .filter((member) => member.id !== user?.id)
            .map((member) => member.id)
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
                        let receiverPublicKey;
                        if (receiver)
                            receiverPublicKey = await getUserPublicKey(receiver?.id!);
                        else
                            receiverPublicKey = currentUserPublicKey;


                        if (!receiverPublicKey) {
                            console.error(`Failed to fetch public key for user ${msg.senderId}`);
                            return { ...msg, content: null };
                        }
                        let decryptedText;

                        if (msg.isDeleted) {
                            decryptedText = "this message is deleted";
                        } else {
                            decryptedText = await decryptPrivateMessage(
                                msg.encryptedContent!,
                                msg.nonce!,
                                receiverPublicKey,
                                currentUserPrivateKey,
                            );
                        }
                        return { ...msg, content: decryptedText };
                    })
                );
            } else {
                decryptedChats = await Promise.all(
                    initialData.messages.map((msg) => {
                        let decryptedText;
                        if (msg.isDeleted) {
                            decryptedText = "this message is deleted";
                        } else {
                            decryptedText = msg.encryptedContent;
                        }
                        return { ...msg, content: decryptedText };
                    })
                );
            }

            setMessages(decryptedChats);
        }

        setDecryptedMessages();
    }, [initialData.messages, user?.id, chatType, receiver, setMessages, user]);

    return (
        <div className="relative flex h-full overflow-hidden">
            {/* Main Chat Container */}
            <div className={`relative flex flex-col h-full duration-500 ${showDetails ? `w-1/2 ` : `w-full`}`}>
                {/* Chat Header */}
                <div className="w-full h-[64px]">
                    {chatType === "group" ? (
                        <ChatHeader
                            name={groupChatData!.name}
                            imageUrl={groupChatData!.imageUrl!}
                            isGroupChat={true}
                            currentUser={user!}
                            groupId={groupChatData?.chatId}
                            setShowDetails={SetShowDetails}
                            showDetails={showDetails}
                        />
                    ) : (
                        <ChatHeader currentUser={user!} receiver={receiver!} setShowDetails={SetShowDetails} showDetails={showDetails} />
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
                        SetReplyingMessage={setReplingMessage}
                        setReplying={setReplying}
                        reciverId={receiver?.id!}
                        isGroup={chatType === "group"}
                    />
                </div>

                {/* Message Input */}
                <div className="w-full p-3 bg-secondary">
                    {chatType === "group" ? (
                        <MessageInput
                            senderId={user?.id!}
                            receiversId={receiversId}
                            setToBottom={setToBottom}
                            isGroup={true}
                            setReplying={setReplying}
                            replying={replying}
                            replyingMessage={replyingMessage}
                        />
                    ) : (
                        <MessageInput senderId={user?.id!} receiverId={receiver?.id} setToBottom={setToBottom} setReplying={setReplying}
                            replying={replying}
                            replyingMessage={replyingMessage} />
                    )}
                </div>
            </div>

            {/* Details Panel */}

            <div
                className={`absolute top-0 right-0 h-full bg-secondary border-l border-foreground/10 w-1/2 overflow-y-auto duration-500 ${showDetails ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {chatType === "group" ?

                    <GroupDetails groupChatData={groupChatData!} /> :

                    <UserDetails
                        name={receiver?.displayName!}
                        bio={receiver?.bio!}
                        username={receiver?.username!}
                        imageUrl={receiver?.imageUrl!}
                        userId={receiver?.id!}
                    />
                }
            </div>
        </div>
    );
}
