import ChatMessages from "@/components/chat/shared/Messages";
import { getUser } from "@/actions/user/getUser";
import { db } from "@/lib/db";
import SectionHeader from "./SectionHeader";
import MessageInput from "../shared/MessageInput";

interface ChatSectionProps {
    params: {
        groupChatId: string
    }
}

export default async function Chatsection({
    params
}: ChatSectionProps) {

    const { user } = await getUser();

    const chat = await db.chat.findUnique({
        where: {
            id: params.groupChatId
        },
        include: {
            messages: true,
            members: true
        }
    })

    return (
        <div className="h-full flex flex-col">
            <div className="h-16">
                <SectionHeader params={params} />

            </div>

            <div className="flex-1 overflow-y-auto p-2">
                <ChatMessages
                    chatId={chat?.id!}
                    messages={chat?.messages!}
                    userId={user?.id!}

                />
            </div>

            <div className="p-3 bg-[#1E1F22] border-l-[1px] border-slate-200 border-opacity-10 ">
                <MessageInput
                    senderId={user?.id!}
                />
            </div>
        </div>
    );
}