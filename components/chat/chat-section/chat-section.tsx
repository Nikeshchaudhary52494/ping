import { getUser } from "@/actions/user/getUser";
import ChatInput from "../chat-input";
import ChatSectionHeader from "../chat-section-header";
import ChatMessages from "./chat-messages";

interface chatSectionProps {
    params: {
        privateChatId?: string;
        groupChatId?: string
    }
}

const Chatsection = async ({ params }: chatSectionProps) => {
    const { user } = await getUser();
    return (
        <div className="flex flex-col h-full">
            <div className="h-16">
                <ChatSectionHeader params={params} />
            </div>

            <div className="flex-1 p-2 overflow-y-auto">
                <ChatMessages params={params} />
            </div>

            <div className="p-3 bg-[#1E1F22] border-l-[1px] border-slate-200 border-opacity-10 ">
                <ChatInput senderId={user?.id!} />
            </div>
        </div>
    );
}

export default Chatsection;
