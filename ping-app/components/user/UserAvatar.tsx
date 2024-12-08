"use client";

import { User } from "lucide-react";
import Image from "next/image";

interface UserAvatarProps {
    imageUrl?: string | null;
    displayName?: string | null;
    size?: number;
}

export function UserAvatar({ imageUrl, displayName, size = 48 }: UserAvatarProps) {
    return (
        <div
            className="relative flex bg-[#252B2E] rounded-full overflow-hidden items-center justify-center"
            style={{ width: size, height: size }}
        >
            {imageUrl ? (
                <Image
                    fill
                    src={imageUrl}
                    alt={displayName || "Profile Image"}
                    className="object-cover"
                />
            ) : (
                <User className="text-slate-400" />
            )}
        </div>
    );
}