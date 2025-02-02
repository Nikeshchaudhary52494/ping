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
        <div className="flex flex-col h-full">
            <SectionHeader params={params} />
            <div className="flex-1 p-2 overflow-y-auto">
                <ChatMessages
                    messages={chat?.messages!}
                    userId={user?.id!}
                    toBottom={true}
                    setToBottom={() => { }}
                />
            </div>

            <div className="p-3 bg-[#1E1F22] sm:border-l-[1px] border-slate-200 border-opacity-10 ">
                <MessageInput
                    senderId={user?.id!}
                    setToBottom={() => { }}
                />
            </div>
        </div>
    );
}