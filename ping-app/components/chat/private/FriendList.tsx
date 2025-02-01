"use client";

import FriendListItem from "./FriendListItem";
import { useSocketContext } from "@/components/providers/socketProvider";
import { useUser } from "@/components/providers/userProvider";
import { PrivateChat } from "@/types/prisma";
import { useParams } from "next/navigation";

interface FriendsListProps {
    privateChats: PrivateChat[]
}

export default function FriendList({
    privateChats
}: FriendsListProps) {

    const { user } = useUser();
    const { onlineUsers } = useSocketContext();
    const params = useParams();

    const paramChatId = params?.privateChatId as string;

    const sortedPrivateChats = privateChats.sort((a, b) => {
        const lastMessageA = a.messages.length > 0 ? a.messages[a.messages.length - 1].createdAt : new Date(0);
        const lastMessageB = b.messages.length > 0 ? b.messages[b.messages.length - 1].createdAt : new Date(0);

        return new Date(lastMessageB).getTime() - new Date(lastMessageA).getTime();
    });

    return (
        <div className="h-full">
            <p className="p-2">Messages</p>
            <div className="flex flex-col mt-2">
                {sortedPrivateChats.map(({ id, members, messages, type }) => (
                    type == "PRIVATE" ? (
                        <FriendListItem
                            key={id}
                            currentProfileId={user?.id!}
                            displayName={members[0].displayName}
                            imageUrl={members[0].imageUrl!}
                            isOnline={onlineUsers.includes(members[0].id)}
                            isActive={paramChatId == id}
                            privateChatId={id}
                            lastMessage={messages[0]}
                        />
                    ) : (
                        <FriendListItem
                            key={id}
                            currentProfileId={user?.id!}
                            displayName={user?.displayName! + "(YOU)"}
                            imageUrl={user?.imageUrl!}
                            isOnline={false}
                            isActive={paramChatId == id}
                            privateChatId={id}
                            lastMessage={messages[0]}
                        />
                    )
                ))}
            </div>
        </div>
    );
}
