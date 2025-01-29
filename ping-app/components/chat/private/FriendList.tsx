"use client";

import FriendListItem from "./FriendListItem";
import { useSocketContext } from "@/components/providers/socketProvider";
import { useUser } from "@/components/providers/userProvider";
import { User } from "@prisma/client";
import { useParams } from "next/navigation";

interface FriendsListProps {
    friendList: any;
}

export default function FriendList({ friendList }: FriendsListProps) {
    const { user } = useUser();
    const { onlineUsers } = useSocketContext();
    const params = useParams();

    const chatId = params?.privateChatId as string;

    // Extract all friends from chats excluding the current user
    const friends = friendList?.chats?.flatMap((chat: any) =>
        chat.members.filter((friend: User) => friend.id !== user?.id)
    ) || [];

    const activeChat = friendList?.chats?.find((chat: any) => chat.id === chatId);
    const activeFriend = activeChat?.members.find(
        (friend: User) => friend.id !== user?.id
    );

    return (
        <div className="h-full">
            <p className="p-2">Messages</p>
            <div className="flex flex-col mt-2">

                <FriendListItem
                    currentProfileId={user?.id!}
                    friendId={user?.id!}
                    displayName={`${user?.displayName} (YOU)`}
                    imageUrl={user?.imageUrl!}
                    isOnline={false}
                    isActive={activeChat && !activeFriend}
                />

                {friends.map((friend: User) => (
                    <FriendListItem
                        key={friend.id}
                        currentProfileId={user?.id!}
                        friendId={friend.id}
                        displayName={friend.displayName}
                        imageUrl={friend.imageUrl!}
                        isOnline={onlineUsers.includes(friend.id)}
                        isActive={activeFriend?.id === friend.id}
                    />
                ))}
            </div>
        </div>
    );
}
