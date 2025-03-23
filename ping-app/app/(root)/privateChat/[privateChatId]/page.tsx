import { Suspense } from "react";
import { getPaginatedMessages } from "@/actions/chat/shared/getPaginatedMessages";
import { db } from "@/lib/db"
import ChatSkeleton from "@/components/skeletons/Chat";
import ChatSection from "@/components/chat/ChatSection";

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
        }),
    ]);

    return (
        <ChatSection
            chatType="private"
            initialData={initialData}
            privateChatId={params.privateChatId}
            members={privateChat?.members!}
        />

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