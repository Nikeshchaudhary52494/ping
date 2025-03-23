"use client";

import { useSocketContext } from "@/components/providers/socketProvider";
import { useUser } from "@/components/providers/userProvider";
import { useParams } from "next/navigation";
import ChatListItem from "./ChatListItem";
import { useChatData } from "../providers/chatDataProvider";

export default function FriendList() {
    const { user } = useUser();
    const { onlineUsers } = useSocketContext();
    const params = useParams();
    const { privateChats } = useChatData();

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
                    type === "PRIVATE" ? (
                        <ChatListItem
                            key={id}
                            name={members[0].displayName}
                            imageUrl={members[0].settings?.showProfileImage ? members[0].imageUrl : ""}
                            isOnline={members[0].settings?.hideOnlineStatus ? false : onlineUsers.includes(members[0].id)}
                            isActive={paramChatId === id}
                            chatId={id}
                            lastMessage={messages[0]}
                            reciverId={members[0].id}
                        />
                    ) : (
                        <ChatListItem
                            key={id}
                            name={`${user?.displayName}(YOU)`}
                            imageUrl={user?.imageUrl || ""}
                            isOnline={false}
                            isActive={paramChatId === id}
                            chatId={id}
                            lastMessage={messages[0]}
                        />
                    )
                ))}
            </div>
        </div>
    );
}