"use client";

import { useSocketContext } from "@/components/providers/socketProvider";
import { UserAvatar } from "@/components/user/UserAvatar";
import { User } from "@prisma/client";

interface HeaderProfileProps {
    user: User
    isCurrentUser?: boolean;
}

export function HeaderProfile({
    user,
    isCurrentUser
}: HeaderProfileProps) {

    const { onlineUsers } = useSocketContext();
    const isOnline = onlineUsers.includes(user.id);

    return (
        <div className="flex items-center md:gap-2">
            <div className="mx-3">
                <UserAvatar
                    imageUrl={user.imageUrl}
                    isOnline={isOnline && !isCurrentUser}
                />
            </div>
            <div className="flex flex-col text-xs">
                <span className="font-medium">
                    {user.displayName}
                    {isCurrentUser && " (YOU)"}
                </span>
                {!isCurrentUser && user.username && (
                    <span className="text-xs text-start text-slate-400">
                        @{user.username}
                    </span>
                )}
            </div>
        </div>
    );
}