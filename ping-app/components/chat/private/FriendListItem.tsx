import { UserAvatar } from "@/components/user/UserAvatar";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface FriendListItemProps {
    imageUrl: string;
    displayName: string;
    currentProfileId: string;
    isActive: boolean;
    isOnline: boolean;
    privateChatId: string;
    lastMessage?: {
        createdAt: Date;
        updatedAt: Date;
        content: string | null;
        isDeleted: boolean;
    };
}

export default function FriendListItem({
    imageUrl,
    displayName,
    isActive,
    isOnline,
    privateChatId,
    lastMessage,
}: FriendListItemProps) {

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
            onClick={() => router.push(`/privateChat/${privateChatId}`)}
            className={`flex gap-2 w-full relative hover:bg-[#2d3538] p-2 cursor-pointer ${isActive && `bg-[#252B2E]`}`}
        >
            <UserAvatar imageUrl={imageUrl} isOnline={isOnline} className="mx-3" />
            <div className="flex flex-col justify-between w-full">
                <div className="flex justify-between">
                    <span className="text-sm truncate">{displayName}</span>
                    <p className="text-xs text-slate-400">{formattedTime}</p>
                </div>
                <p className="mb-2 text-xs truncate max-w-40 text-slate-400">
                    {lastMessage?.content || "No messages yet"}
                </p>
            </div>
        </div>
    );
}
