"use client";

import { UserAvatar } from "@/components/user/UserAvatar";

interface HeaderProfileProps {
    user: {
        imageUrl?: string | null;
        displayName?: string | null;
        username?: string | null;
    };
    isCurrentUser?: boolean;
}

export function HeaderProfile({ user, isCurrentUser }: HeaderProfileProps) {
    return (
        <div className="flex items-center gap-2">
            <div className="mx-3">
                <UserAvatar
                    imageUrl={user.imageUrl}
                    displayName={user.displayName}
                />
            </div>
            <div className="flex flex-col">
                <span className="font-medium">
                    {user.displayName}
                    {isCurrentUser && " (YOU)"}
                </span>
                {!isCurrentUser && user.username && (
                    <span className="text-xs text-slate-400">
                        @{user.username}
                    </span>
                )}
            </div>
        </div>
    );
}