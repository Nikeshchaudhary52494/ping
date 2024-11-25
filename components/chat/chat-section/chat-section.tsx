import { getUser } from "@/actions/user/getUser";
import ChatInput from "../chat-input";
import ChatSectionHeader from "../chat-section-header";
import ChatMessages from "./chat-messages";
import { db } from "@/lib/db";

interface chatSectionProps {
    params: {
        privateChatId?: string;
        groupChatId?: string
    }
}

const Chatsection = async ({ params }: chatSectionProps) => {

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
        <div className="flex flex-col h-full">
            <div className="h-16">
                <ChatSectionHeader params={params} />
            </div>

            <div className="flex-1 p-2 overflow-y-auto">
                <ChatMessages
                    chatId={chat?.id!}
                    messages={chat?.messages!}
                    userId={user?.id!}

                />
            </div>

            <div className="p-3 bg-[#1E1F22] border-l-[1px] border-slate-200 border-opacity-10 ">
                <ChatInput
                    senderId={user?.id!}
                    receiverId={secondPerson?.id!}
                />
            </div>
        </div>
    );
}

export default Chatsection;
