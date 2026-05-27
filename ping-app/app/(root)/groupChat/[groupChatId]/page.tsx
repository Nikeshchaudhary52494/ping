import { getPaginatedMessages } from "@/actions/chat/shared/getPaginatedMessages";
import ChatSection from "@/components/chat/ChatSection";
import ChatSkeleton from "@/components/skeletons/Chat";
import { db } from "@/lib/db";
import { Suspense } from "react";

interface GroupsProps {
    params: Promise<{
        groupChatId: string
    }>
}

async function ChatContent({ params }: GroupsProps) {
    const { groupChatId } = await params;
    const groupChatData = await db.groupChat.findUnique({
            where: {
                chatId: groupChatId
            },
            select: {
                id: true,
                chatId: true,
                name: true,
                imageUrl: true,
                ownerId: true,
                about: true,
                admins: {
                    select: {
                        id: true,
                    }
                },
                members: {
                    select: {
                        id: true,
                        displayName: true,
                        imageUrl: true,
                        username: true,
                    }
                }
            }
        })
        
    return (
        <ChatSection
            chatType="group"
            initialData={{ messages: [], nextCursor: null }}
            groupChatData={groupChatData!}

        />

    );
}

export default async function Page({ params }: GroupsProps) {
    return (
        <div className="h-full">
            <ChatContent params={params} />
        </div>
    )
}