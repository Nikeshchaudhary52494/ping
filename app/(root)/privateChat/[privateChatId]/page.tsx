import Chatsection from "@/components/chat/chat-section/chat-section";

interface chatsProps {
    params: {
        privateChatId?: string;
        groupChatId?: string
    }
}

export default async function chats({ params }: chatsProps) {
    return (
        <div className="h-full">
            <Chatsection params={params} />
        </div>
    )
}