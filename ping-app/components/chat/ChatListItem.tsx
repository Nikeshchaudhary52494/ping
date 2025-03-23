import getUserPublicKey from "@/actions/user/getUserPublicKey";
import { UserAvatar } from "@/components/user/UserAvatar";
import { decryptPrivateMessage } from "@/lib/crypto";
import { GroupChatData, LastMessage } from "@/types/prisma";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useUser } from "../providers/userProvider";

interface ChatListItemProps {
    imageUrl: string | null;
    name: string;
    chatId: string;
    isActive?: boolean;
    isOnline?: boolean;
    lastMessage?: LastMessage;
    isGroupChat?: boolean;
    groupChatData?: GroupChatData;
    reciverId?: string
}

export default function ChatListItem({
    imageUrl,
    name,
    chatId,
    isActive = false,
    isOnline = false,
    lastMessage,
    isGroupChat = false,
    groupChatData,
    reciverId
}: ChatListItemProps) {

    const router = useRouter();
    const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);
    const { user } = useUser();

    // Format last message timestamp
    const formattedTime = useMemo(() => {
        return lastMessage?.createdAt
            ? new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            }).format(new Date(lastMessage.createdAt))
            : "";
    }, [lastMessage?.createdAt]);

    useEffect(() => {
        const decryptMessage = async () => {
            const currentUserPrivateKey = localStorage.getItem("pingPrivateKey");
            const currentUserPublicKey = localStorage.getItem("pingPublicKey");

            if (!currentUserPrivateKey || !currentUserPublicKey) {
                console.error("No key pair found in local storage for current user.");
                return;
            }

            if (!lastMessage) {
                setDecryptedMessage("No messages yet");
                return;
            }

            try {
                let decryptedText;
                if (!isGroupChat) {
                    let receiverPublicKey;
                    if (reciverId)
                        receiverPublicKey = await getUserPublicKey(reciverId);
                    else
                        receiverPublicKey = currentUserPublicKey;

                    if (!receiverPublicKey) {
                        console.error(`Failed to fetch public key for user ${lastMessage.senderId}`);
                        setDecryptedMessage("Failed to decrypt message");
                        return;
                    }

                    if (lastMessage.isDeleted) {
                        decryptedText = "This message is deleted";
                    } else {
                        decryptedText = await decryptPrivateMessage(
                            lastMessage.encryptedContent!,
                            lastMessage.nonce!,
                            receiverPublicKey,
                            currentUserPrivateKey
                        );
                    }
                } else {
                    if (lastMessage.isDeleted) {
                        decryptedText = "This message is deleted";
                    } else {
                        decryptedText = lastMessage.encryptedContent;
                    }
                }

                setDecryptedMessage(decryptedText);
            } catch (error) {
                console.error("Failed to decrypt message:", error);
                setDecryptedMessage("Failed to decrypt message");
            }
        };

        decryptMessage();
    }, [lastMessage, isGroupChat, groupChatData, reciverId, user?.id]);

    return (
        <div
            onClick={() => router.push(isGroupChat ? `/groupChat/${chatId}` : `/privateChat/${chatId}`)}
            className={`flex gap-2 w-full relative hover:bg-primary/80 p-2 hover:text-primary-foreground group cursor-pointer ${isActive && "bg-primary/50 text-primary-foreground"}`}
        >
            <UserAvatar imageUrl={imageUrl} isOnline={isGroupChat ? false : isOnline} className="mx-3" />
            <div className="flex flex-col justify-between w-full">
                <div className="flex justify-between">
                    <p className="text-sm truncate">{name}</p>
                    <p className="text-xs">{formattedTime}</p>
                </div>
                <p className={`mb-2 text-xs truncate max-w-40 group-hover:text-primary-foreground ${isActive ? `text-primary-foreground/50` : `text-secondary-foreground/50`}`}>
                    {decryptedMessage || "No messages yet"}
                </p>
            </div>
        </div>
    );
}