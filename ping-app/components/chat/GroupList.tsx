import { UserGroups } from "@/types/prisma";
import ChatListItem from "./ChatListItem";

interface GroupListParams {
    groupList: UserGroups[]
}

export default function GroupList({
    groupList
}: GroupListParams) {

    return (
        <div className="h-full">
            <p className="p-2">Groups</p>
            <div className="flex flex-col mt-2">
                {groupList.map(({ chat, id, imageUrl, name }) => (
                    <ChatListItem
                        key={id}
                        chatId={chat.id}
                        imageUrl={imageUrl}
                        name={name}
                        isActive={false}
                        lastMessage={chat.messages[0]}
                        isGroupChat={true}
                    />
                ))}
            </div>
        </div>
    );
}