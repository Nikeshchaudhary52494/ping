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
import getUserPublicKey from "@/lib/getUserPublicKeyClient";
import { decryptPrivateMessage } from "@/lib/crypto";
import { GroupDetails } from "./groupDetails";
import { UserDetails } from "./userDetails";
import { getPaginatedMessages } from "@/actions/chat/shared/getPaginatedMessages";
import { idbMessages } from "@/lib/indexedDB";


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
    const isIamBlocked = receiver?.blockedContacts.some(contact => contact.blockedId === user?.id) ?? false;

    const receiversId = chatType === "group"
        ? groupChatData?.members
            .filter((member) => member.id !== user?.id)
            .map((member) => member.id)
        : [];


    const decryptMessagesCallback = async (msgs: any[]) => {
        const currentUserPrivateKey = localStorage.getItem("pingPrivateKey");
        const currentUserPublicKey = localStorage.getItem("pingPublicKey");
        
        let receiverPublicKey: string | null | undefined = undefined;
        if (chatType === "private") {
            receiverPublicKey = receiver ? await getUserPublicKey(receiver.id) : currentUserPublicKey;
        }

        return await Promise.all(
            msgs.map(async (msg: any) => {
                let decryptedText;
                if (msg.isDeleted) {
                    decryptedText = "this message is deleted";
                } else if (chatType === "group") {
                    decryptedText = msg.encryptedContent;
                } else {
                    if (!receiverPublicKey || !currentUserPrivateKey) {
                        decryptedText = "Failed to decrypt";
                    } else {
                        try {
                            decryptedText = await decryptPrivateMessage(
                                msg.encryptedContent!,
                                msg.nonce!,
                                receiverPublicKey,
                                currentUserPrivateKey
                            );
                        } catch (e) {
                            decryptedText = "Failed to decrypt";
                        }
                    }
                }
                return { ...msg, content: decryptedText };
            })
        );
    };

    const { toBottom, isLoading, loadMoreMessages, hasNextMessage, setToBottom }
        = useChatScroll({
            nextCursor: initialData.nextCursor,
            scrollContainerRef,
            setMessages,
            privateChatId: privateChatId ?? groupChatData?.chatId!,
            decryptMessages: decryptMessagesCallback,
        });

    useEffect(() => {
        if (!user) return;

        async function loadMessages() {
            const chatId = privateChatId ?? groupChatData?.chatId;
            if (!chatId) return;

            // 1. Load instantly from IndexedDB
            const localMessages = await idbMessages.getByChatId(chatId);
            if (localMessages.length > 0) {
                setMessages(localMessages as any);
            }

            // 2. Fetch fresh from server in the background
            try {
                const fetchedData = await getPaginatedMessages({
                    privateChatId: chatType === "private" ? chatId : undefined,
                    groupChatId: chatType === "group" ? chatId : undefined
                });

                if (fetchedData.messages && fetchedData.messages.length > 0) {
                    const decryptedChats = await decryptMessagesCallback(fetchedData.messages);
                    await idbMessages.putBulk(decryptedChats as any);
                    
                    const allMessagesMap = new Map();
                    localMessages.forEach((msg: any) => allMessagesMap.set(msg.id, msg));
                    decryptedChats.forEach((msg: any) => allMessagesMap.set(msg.id, msg));
                    
                    const mergedMessages = Array.from(allMessagesMap.values())
                        .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

                    setMessages(mergedMessages as any);
                }
            } catch (error) {
                console.error("Failed to fetch fresh messages:", error);
            }
        }

        loadMessages();
    }, [user?.id, chatType, receiver, setMessages, user, privateChatId, groupChatData]);

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
                        members={groupChatData?.members}
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
                            isIamBlocked={false}
                        />
                    ) : (
                        <MessageInput
                            senderId={user?.id!}
                            receiverId={receiver?.id}
                            setToBottom={setToBottom}
                            setReplying={setReplying}
                            replying={replying}
                            replyingMessage={replyingMessage}
                            isIamBlocked={isIamBlocked}
                        />
                    )}
                </div>
            </div>

            {/* Details Panel */}

            <div
                className={`absolute top-0 right-0 h-full bg-secondary border-l border-foreground/10 w-1/2 overflow-y-auto duration-500 ${showDetails ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {chatType === "group" ?

                    <GroupDetails 
                        groupChatData={groupChatData!} 
                        setShowDetails={SetShowDetails} 
                    /> :

                    <UserDetails
                        name={receiver?.displayName!}
                        bio={receiver?.bio!}
                        username={receiver?.username!}
                        imageUrl={receiver?.imageUrl!}
                        userId={receiver?.id!}
                        setShowDetails={SetShowDetails}
                    />
                }
            </div>
        </div>
    );
}
