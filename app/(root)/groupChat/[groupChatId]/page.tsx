import GroupChatsection from "@/components/group-chat/group-chat-section/group-chat-section"

interface GroupsProps {
    params: {
        groupChatId: string
    }
}

export default function Groups({ params }: GroupsProps) {
    return (
        <div className="h-full">
            <GroupChatsection params={params} />
        </div>
    )
}