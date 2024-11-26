import { GroupChat } from "@prisma/client";
import GroupListItem from "./group-list-item";

interface GroupListParams {
    groupList: GroupChat[]
}

export default function GroupList({ groupList }: GroupListParams) {

    return (
        <div className="h-full">
            <p className="p-2">
                Groups
            </p>
            <div
                className="flex sh-full flex-col mt-2">
                {groupList.map(group => (
                    <GroupListItem
                        key={group.id}
                        groupId={group.chatId}
                        imageUrl={group.imageUrl}
                        name={group.name}
                    />
                ))}
            </div>
        </div>
    );
}
