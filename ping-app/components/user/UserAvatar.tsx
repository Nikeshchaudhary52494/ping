"use client";

import clsx from "clsx";
import { User, UsersRound } from "lucide-react";
import Image from "next/image";

interface UserAvatarProps {
    imageUrl?: string | null;
    size?: number;
    isOnline?: boolean;
    className?: string;
    isGroupAvatar?: boolean;
}

export function UserAvatar({
    imageUrl,
    size = 48,
    className,
    isGroupAvatar,
    isOnline = false
}: UserAvatarProps) {

    return (
        <div className={clsx("relative", className)}>
            <div
                className="relative flex bg-background/40 rounded-full overflow-hidden items-center justify-center"
                style={{ width: size, height: size }}
            >
                {imageUrl ? (
                    <Image
                        fill
                        src={imageUrl}
                        alt="display profile"
                        className="object-cover"
                    />
                ) :
                    isGroupAvatar ?
                        <UsersRound /> :
                        <User />
                }
            </div>
            {isOnline && (
                <div className="bg-primary rounded-full h-3 w-3 absolute bottom-0 right-0 border-2 border-secondary-foreground/20" />
            )}
        </div>

    );
}