import { UserAvatar } from "@/components/user/UserAvatar";
import { db } from "@/lib/db";

interface SectionHeaderProps {
    params: {
        groupChatId: string
    }
}

export default async function SectionHeader({
    params
}: SectionHeaderProps) {

    const groupChat = await db.groupChat.findFirst({
        where: {
            chatId: params.groupChatId?.toString(),
        }
    })

    return (
        <div
            className="flex gap-2 w-full  items-center duration-100 bg-[#1E1F22] sm:border-l-[1px] border-slate-200 border-opacity-10 p-2">
            <UserAvatar
                imageUrl={groupChat?.imageUrl}
                isGroupAvatar={true}
            />
            <span className="font-bold">
                {groupChat?.name}
            </span>
        </div>
    );
}
