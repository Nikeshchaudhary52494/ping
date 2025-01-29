"use client"

import { User } from "@prisma/client";
import FriendListItem from "./FriendListItem";
import { useSocketContext } from "@/components/providers/socketProvider";
import { useUser } from "@/components/providers/userProvider";

interface FriendsListProps {
    friendList: any
}

export default function FriendList({ friendList }: FriendsListProps) {

    const { user } = useUser();

    // Extract all members from chats and exclude the current user
    const friends =
        friendList?.chats.flatMap((chat: any) =>
            chat.members.filter((friend: User) => friend.id !== user?.id)
        ) || [];

    const { onlineUsers } = useSocketContext();

    return (
        <div className="h-full">
            <p className="p-2">Messages</p>
            <div className="flex flex-col mt-2">
                <FriendListItem
                    currentProfileId={user?.id!}
                    friendId={user?.id!}
                    displayName={`${user?.displayName} (YOU)`}
                    imageUrl={user?.imageUrl!}
                    isActive={false}
                />
                {friends.map((friend: User) => (
                    <FriendListItem
                        key={friend?.id}
                        currentProfileId={user?.id!}
                        displayName={friend?.displayName}
                        friendId={friend?.id}
                        imageUrl={friend?.imageUrl!}
                        isActive={onlineUsers.includes(friend.id)}
                    />
                ))}
            </div>
        </div>
    );
}
