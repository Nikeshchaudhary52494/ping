import { Suspense } from "react";
import { getPaginatedMessages } from "@/actions/chat/shared/getPaginatedMessages";
import { db } from "@/lib/db"
import ChatSection from "@/components/chat/private/ChatSection";
import ChatSkeleton from "@/components/skeletons/Chat";

interface ChatsProps {
    params: {
        privateChatId: string;
    };
}

async function ChatContent({ params }: ChatsProps) {
    const [initialData, privateChat] = await Promise.all([
        getPaginatedMessages({ privateChatId: params.privateChatId }),
        db.chat.findUnique({
            where: { id: params.privateChatId },
            select: { members: true },
        }),
    ]);

    return (
        <ChatSection params={params} initialData={initialData} members={privateChat?.members || []} />
    );
}

export default function Page({ params }: ChatsProps) {
    return (
        <div className="h-full">
            <Suspense fallback={< ChatSkeleton />}>
                <ChatContent params={params} />
            </Suspense>
        </div>
    );
}  