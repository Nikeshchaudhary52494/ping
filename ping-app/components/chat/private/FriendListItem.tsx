import { getOrCreatePrivateChatId } from "@/actions/chat/privateChat/getOrCreatePrivateChatId";
import { User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface FriendListItemProps {
    imageUrl: string;
    friendId: string;
    displayName: string;
    currentProfileId: string;
    isActive: boolean;
}

export default function FriendListItem({
    imageUrl,
    displayName,
    friendId,
    currentProfileId,
    isActive,
}: FriendListItemProps) {
    const router = useRouter();

    const onClick = async (memberOne: string, memberTwo: string) => {
        const privateChatId = await getOrCreatePrivateChatId(memberOne, memberTwo);
        router.push(`/privateChat/${privateChatId}`);
    };

    return (
        <div
            onClick={() => onClick(friendId, currentProfileId)}
            className="flex gap-2 w-full relative hover:bg-[#252B2E] p-2 cursor-pointer"
        >
            <div className="relative mx-3">
                <div className="relative flex h-[48px] w-[48px] bg-[#252B2E] items-center justify-center rounded-full overflow-hidden">
                    {imageUrl ? (
                        <Image
                            fill
                            className="object-cover"
                            src={imageUrl}
                            alt="UserProfile"
                        />
                    ) : (
                        <User className="text-slate-400" />
                    )}

                </div>
                {isActive && (
                    <div className="bg-green-500 rounded-full h-3 w-3 absolute bottom-0 right-0 border-2 border-[#252B2E]" />
                )}
            </div>

            <div className="flex flex-col">
                <span className="text-sm">{displayName}</span>
            </div>
        </div>
    );
}
