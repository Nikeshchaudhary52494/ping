import FriendListItem from "./FriendListItem";
import { User } from "@prisma/client";
import { getFriendList } from "@/actions/chat/privateChat/getFriendList";

interface FriendsListProps {
    user: User
}
export default async function FriendList({
    user
}: FriendsListProps) {
    const friendList = await getFriendList(user.id);

    const friends = friendList?.chats.flatMap(chat =>
        chat.members
    ) || [];

    console.log(friends)

    return (
        <div className="h-full">
            <p className="p-2">
                Messages
            </p>
            <div
                className="flex sh-full flex-col mt-2">
                <FriendListItem
                    currentProfileId={user?.id!}
                    friendId={user?.id!}
                    displayName={user?.displayName + "(YOU)"}
                    imageUrl={user?.imageUrl!}
                />
                {friends.map(friend => {
                    return (
                        <FriendListItem
                            key={friend?.id}
                            currentProfileId={user.id}
                            displayName={friend?.displayName}
                            friendId={friend?.id}
                            imageUrl={friend?.imageUrl!}
                        />
                    )
                }
                )}
            </div>
        </div>
    );
}
