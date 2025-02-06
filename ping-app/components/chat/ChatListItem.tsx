import { UserAvatar } from "@/components/user/UserAvatar";
import { LastMessage } from "@/types/prisma";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface ChatListItemProps {
    imageUrl: string | null;
    name: string;
    chatId: string;
    isActive?: boolean;
    isOnline?: boolean;
    lastMessage?: LastMessage;
    isGroupChat?: boolean;
}

export default function ChatListItem({
    imageUrl,
    name,
    chatId,
    isActive = false,
    isOnline = false,
    lastMessage,
    isGroupChat = false,
}: ChatListItemProps) {

    const router = useRouter();

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
                <p className={`mb-2 text-xs truncate max-w-40 group-hover:text-primary-foreground ${isActive?`text-primary-foreground/50`:`text-secondary-foreground/50`}`}>
                    {lastMessage?.content || "No messages yet"}
                </p>
            </div>
        </div>
    );
}
