"use client"

import { getOrCreatePrivateChatId } from "@/actions/chat/privateChat/getOrCreatePrivateChatId";
import { User } from "lucide-react";
import Image from "next/image"
import { useRouter } from "next/navigation";

interface FriendListItemProps {
    imageUrl: string,
    friendId: string,
    displayName: string
    currentProfileId: string
}
export default function FriendListItem({
    imageUrl,
    displayName,
    friendId,
    currentProfileId
}: FriendListItemProps) {

    const router = useRouter();

    const onClick = async (
        memberOne: string, memberTwo: string
    ) => {
        const privateChatId = await getOrCreatePrivateChatId(memberOne, memberTwo);
        router.push(`/privateChat/${privateChatId}`);
    };
    return (
        <div
            onClick={() => onClick(friendId, currentProfileId)}
            className="flex gap-2 w-full hover:bg-[#252B2E] p-2">
            <div
                className="relative flex mx-3 h-[48px] w-[48px] bg-[#252B2E] items-center justify-center rounded-full overflow-hidden"
            >
                {imageUrl ?
                    <Image
                        fill
                        src={imageUrl}
                        alt="UserProfile" /> :
                    <User className="text-slate-400" />}
            </div>
            <div className="flex flex-col">
                <span className="text-sm">
                    {displayName}
                </span>
            </div>
        </div>
    )
}