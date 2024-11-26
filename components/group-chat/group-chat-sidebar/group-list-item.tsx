"use client"

import { UsersRound } from "lucide-react";
import Image from "next/image"
import { useRouter } from "next/navigation";

interface FriendListItemProps {
    imageUrl: string | null
    name: string,
    groupId: string
}
export default function GroupListItem({
    imageUrl,
    groupId,
    name
}: FriendListItemProps) {

    const router = useRouter();

    const onClick = (
        groupId: string
    ) => {
        router.push(`/groupChat/${groupId}`)
    };

    return (
        <div
            onClick={() => onClick(groupId)}
            className="flex gap-2 w-full group duration-100 hover:bg-[#252B2E] p-2">
            <div
                className="relative flex mx-3 h-[48px] w-[48px] bg-[#252B2E] items-center justify-center rounded-full overflow-hidden"
            >
                {imageUrl ?
                    <Image
                        fill
                        src={imageUrl}
                        alt="UserProfile" /> :
                    <UsersRound className="text-slate-400" />}
            </div>
            <div className="flex flex-col">
                <span>
                    {name}
                </span>
            </div>
        </div>
    )
}