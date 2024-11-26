import { db } from "@/lib/db";
import { UsersRound } from "lucide-react";
import Image from "next/image";

interface ChatSectionHeaderProps {
    params: {
        privateChatId?: string;
        groupChatId?: string
    }
}

export default async function GroupChatSectionHeader({ params }: ChatSectionHeaderProps) {

    const groupChat = await db.groupChat.findFirst({
        where: {
            chatId: params.groupChatId?.toString(),
        }
    })

    return (
        <div
            className="flex gap-2 w-full  items-center duration-100 bg-[#1E1F22] border-l-[1px] border-slate-200 border-opacity-10 p-2">
            <div className="relative flex mx-3 h-[48px] w-[48px] bg-[#252B2E] items-center justify-center rounded-full overflow-hidden"
            >
                {groupChat?.imageUrl ?
                    <Image
                        fill
                        src={groupChat?.imageUrl}
                        alt="UserProfile" /> :
                    <UsersRound className="text-slate-400" />}
            </div>
            <span className="font-bold">
                {groupChat?.name}
            </span>
        </div>
    );
}
