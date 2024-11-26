import GroupChatSectionHeader from "./group-chat-section-header";
import ChatMessages from "@/components/chat/chat-section/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import { getUser } from "@/actions/user/getUser";
import { db } from "@/lib/db";

interface groupChatSectionProps {
    params: {
        groupChatId: string
    }
}

const GroupChatsection = async ({ params }: groupChatSectionProps) => {
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
                <GroupChatSectionHeader params={params} />

            </div>

            <div className="flex-1 overflow-y-auto p-2">
                <ChatMessages
                    chatId={chat?.id!}
                    messages={chat?.messages!}
                    userId={user?.id!}

                />
            </div>

            <div className="p-3 bg-[#1E1F22] border-l-[1px] border-slate-200 border-opacity-10 ">
                <ChatInput
                    senderId={user?.id!}
                />
            </div>
        </div>
    );
}

export default GroupChatsection;
