import { getPaginatedMessages } from "@/actions/chat/shared/getPaginatedMessages";
import ChatSection from "@/components/chat/ChatSection";
import ChatSkeleton from "@/components/skeletons/Chat";
import { db } from "@/lib/db";
import { Suspense } from "react";

interface GroupsProps {
    params: {
        groupChatId: string
    }
}

async function ChatContent({ params }: GroupsProps) {
    const [initialData, groupChatData] = await Promise.all([
        getPaginatedMessages({ groupChatId: params.groupChatId }),
        db.groupChat.findUnique({
            where: {
                chatId: params.groupChatId
            },
            select: {
                chatId: true,
                name: true,
                imageUrl: true,
                nonce: true,
                encryptedKey: true,
                ownerId: true,
                members: {
                    select: {
                        id: true
                    }
                }
            }
        }),
    ]);

    return (
        <ChatSection
            chatType="group"
            initialData={initialData}
            groupChatData={groupChatData!}

        />

    );
}

export default async function Page({ params }: GroupsProps) {
    return (
        <div className="h-full">
            <Suspense fallback={< ChatSkeleton />}>
                <ChatContent params={params} />
            </Suspense>
        </div>
    )
}