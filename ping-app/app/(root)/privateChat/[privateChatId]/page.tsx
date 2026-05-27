import { Suspense } from "react";
import { getPaginatedMessages } from "@/actions/chat/shared/getPaginatedMessages";
import { db } from "@/lib/db"
import ChatSkeleton from "@/components/skeletons/Chat";
import ChatSection from "@/components/chat/ChatSection";

interface ChatsProps {
    params: Promise<{
        privateChatId: string;
    }>;
}

async function ChatContent({ params }: ChatsProps) {
    const { privateChatId } = await params;
    const privateChat = await db.chat.findUnique({
            where: { id: privateChatId },
            select: {
                members: {
                    include: {
                        settings: {
                            select: {
                                hideOnlineStatus: true,
                                hideProfile: true,
                                showProfileImage: true,
                                restrictMessagesFromUnknown: true
                            },
                        },
                        blockedContacts: {
                            select: {
                                blockedId: true,
                            }
                        }
                    }
                }
            },
        })

    return (
        <ChatSection
            chatType="private"
            initialData={{ messages: [], nextCursor: null }}
            privateChatId={privateChatId}
            members={privateChat?.members!}
        />

    );
}

export default function Page({ params }: ChatsProps) {
    return (
        <div className="h-full">
            <ChatContent params={params} />
        </div>
    );
}  