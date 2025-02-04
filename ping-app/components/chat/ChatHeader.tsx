import { UserAvatar } from "@/components/user/UserAvatar";
import { HeaderProfile } from "./HeaderProfile";
import { ActionButtons } from "./ActionButtons";
import { UserTab } from "@/types/prisma";

interface ChatHeaderProps {
    name?: string;
    imageUrl?: string;
    receiver?: UserTab;
    currentUser?: UserTab;
    isGroupChat?: boolean;
}

export default function ChatHeader({
    name,
    imageUrl,
    receiver,
    currentUser,
    isGroupChat = false
}: ChatHeaderProps) {

    return (
        <div className="w-full flex items-center justify-between px-4 sm:border-l-[1px] h-full border-slate-200 border-opacity-10 bg-[#1E1F22]">
            {isGroupChat ? (
                <div className="flex gap-2 items-center">
                    <UserAvatar imageUrl={imageUrl || ""} isGroupAvatar={true} />
                    <span className="font-bold">{name}</span>
                </div>
            ) : (
                <>
                    <HeaderProfile user={receiver || currentUser!} isCurrentUser={!receiver} />
                    <ActionButtons currentUserId={currentUser?.id!} recipientId={receiver?.id!} />
                </>
            )}
        </div>
    );
}
