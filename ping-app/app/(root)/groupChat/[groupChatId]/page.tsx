import Chatsection from "@/components/chat/group/ChatSection"

interface GroupsProps {
    params: {
        groupChatId: string
    }
}

export default function Groups({ params }: GroupsProps) {
    return (
        <div className="h-full">
            <Chatsection params={params} />
        </div>
    )
}