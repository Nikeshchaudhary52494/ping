"use client";

import { useSocketContext } from "@/components/providers/socketProvider";
import { UserAvatar } from "@/components/user/UserAvatar";
import { MyUser } from "@/types/prisma";
import { useUser } from "../providers/userProvider";

interface HeaderProfileProps {
    user: MyUser
    isCurrentUser?: boolean;
    setShowDetails: (value: boolean) => void;
    showDetails: boolean;
}

export function HeaderProfile({
    user,
    isCurrentUser,
    showDetails,
    setShowDetails,
}: HeaderProfileProps) {

    const { onlineUsers } = useSocketContext();
    const isOnline = onlineUsers.includes(user.id);

    const { user: currentUser } = useUser();

    let imageUrl;
    if (currentUser?.id === user.id) {
        imageUrl = user.imageUrl;
    } else {
        if (user.settings?.showProfileImage) {
            imageUrl = user.imageUrl;
        } else {
            imageUrl = "";
        }
    }

    return (
        <div onClick={() => { !isCurrentUser && setShowDetails(!showDetails) }} className="flex items-center">
            <div className="mx-3">
                <UserAvatar
                    imageUrl={imageUrl}
                    isOnline={isOnline && !isCurrentUser && !user.settings?.hideOnlineStatus}
                />
            </div>
            <div className="flex flex-col text-xs text-start">
                <span className="font-medium">
                    {user.displayName}
                    {isCurrentUser && " (YOU)"}
                </span>
                {!isCurrentUser && user.username && (
                    <span className="text-xs text-primary">
                        @{user.username}
                    </span>
                )}
            </div>
        </div>
    );
}