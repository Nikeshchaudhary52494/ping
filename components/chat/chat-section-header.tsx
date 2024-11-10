import { getUser } from "@/actions/user/getUser";
import { db } from "@/lib/db";
import { User } from "lucide-react";
import Image from "next/image";

interface ChatSectionHeaderProps {
    params: {
        privateChatId?: string;
        groupChatId?: string
    }
}

export default async function ChatSectionHeader({ params }: ChatSectionHeaderProps) {
    const privateChat = await db.privateChat.findFirst({
        where: {
            id: params.privateChatId?.toString(),
        },
        include: {
            participants: true
        },
    });

    const { user } = await getUser();

    const secondPerson = privateChat?.participants.find(
        (participant) => participant.id !== user?.id
    );



    if (!secondPerson) {
        return <div className="w-full flex gap-2 items-center border-l-[1px] h-full border-slate-200 border-opacity-10  bg-[#1E1F22]">
            <div className="relative flex mx-3 h-[48px] w-[48px] bg-[#252B2E] rounded-full overflow-hidden items-center justify-center">
                {user?.imageUrl ?
                    <Image
                        fill
                        src={user.imageUrl}
                        alt={user.displayName || "Profile Image"}
                    /> :
                    <User className="text-slate-400" />
                }
            </div>
            <div className="flex flex-col">
                <span className="font-medium">{user?.displayName + " (YOU)"}</span>
            </div>
        </div>
    }

    return (
        <div className="w-full flex gap-2 items-center border-l-[1px] h-full border-slate-200 border-opacity-10  bg-[#1E1F22]">
            <div className="relative flex mx-3 h-[48px] w-[48px] bg-[#252B2E] rounded-full overflow-hidden items-center justify-center">
                {secondPerson.imageUrl ?
                    <Image
                        fill
                        src={secondPerson.imageUrl}
                        alt={secondPerson.displayName || "Profile Image"}
                    /> :
                    <User className="text-slate-400" />
                }
            </div>
            <div className="flex flex-col">
                <span className="font-medium">{secondPerson.displayName}</span>
                <span className="text-xs text-slate-400">{`@${secondPerson.username}`}</span>
            </div>
        </div>
    );
}
