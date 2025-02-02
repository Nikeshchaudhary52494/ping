import { getPaginatedMessages } from "@/actions/chat/shared/getPaginatedMessages";
import Chatsection from "@/components/chat/private/ChatSection";
import { db } from "@/lib/db";

interface chatsProps {
    params: {
        privateChatId: string;
    }
}

export default async function Page({ params }: chatsProps) {

    const initialData = await getPaginatedMessages({ privateChatId: params.privateChatId });
    const privateChat = await db.chat.findUnique({
        where: {
            id: params.privateChatId,
        },
        select: {
            members: true
        }
    });

    return (
        <div className="h-full">
            <Chatsection
                params={params}
                initialData={initialData}
                members={privateChat?.members!}
            />
        </div>
    )
}