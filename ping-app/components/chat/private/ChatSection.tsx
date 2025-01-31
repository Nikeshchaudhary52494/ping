import { getUser } from "@/actions/user/getUser";
import ChatSectionHeader from "./SectionHeader";
import ChatMessages from "../shared/Messages";
import { db } from "@/lib/db";
import MessageInput from "../shared/MessageInput";

interface ChatSectionProps {
    params: {
        privateChatId?: string;
        groupChatId?: string
    }
}

export default async function ChatSection({
    params
}: ChatSectionProps) {

    const chat = await db.chat.findUnique({
        where: {
            id: params.privateChatId
        },
        include: {
            messages: true,
            members: true
        }
    })

    const { user } = await getUser();
    const secondPerson = chat?.members.find(
        (members) => members.id !== user?.id
    );

    return (
        <div className="relative flex flex-col h-full">
            <div className="sticky top-0 z-20 w-full h-[64px] bg-[#1E1F22]">
                <ChatSectionHeader params={params} />
            </div>

            <div className="flex-1 p-2 overflow-y-auto">
                <ChatMessages
                    chatId={chat?.id!}
                    messages={chat?.messages!}
                    userId={user?.id!}
                />
            </div>

            <div className="sticky bottom-0 z-20 w-full p-3 bg-[#1E1F22] sm:border-l border-slate-200 border-opacity-10">
                <MessageInput
                    senderId={user?.id!}
                    receiverId={secondPerson?.id!}
                />
            </div>
        </div>

    );
}