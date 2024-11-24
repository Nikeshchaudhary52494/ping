import { getUser } from "@/actions/user/getUser";
import MessageItem from "./message-item";
import { db } from "@/lib/db";

interface ChatMessagesProps {
    params: {
        privateChatId?: string;
        groupChatId?: string
    };
}

export default async function ChatMessages({ params }: ChatMessagesProps) {
    const chat = await db.chat.findUnique({
        where: {
            id: params.privateChatId
        },
        include: {
            messages: true,
        }
    })
    const { user } = await getUser();

    return (
        <div className="flex flex-col space-y-2">
            {chat?.messages && chat.messages.map(({ content, senderId }, index) => (
                <MessageItem
                    key={index}
                    isMine={user?.id === senderId}
                    content={content!}
                />
            ))}
        </div>
    );
}
