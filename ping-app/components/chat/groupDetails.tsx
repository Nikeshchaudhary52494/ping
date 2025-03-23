import { GroupChatData } from "@/types/prisma";
import { Separator } from "../ui/separator";
import { UserAvatar } from "../user/UserAvatar";
import { removeMemberFromGroup } from "@/actions/chat/groupChat/removeMember";
import { useUser } from "../providers/userProvider";

interface GroupDetailsProps {
    groupChatData: GroupChatData
}

export function GroupDetails({
    groupChatData
}: GroupDetailsProps
) {

    const exitGroup = async (userId: string) => {
        await removeMemberFromGroup(groupChatData.id, userId);
    }
    const { user } = useUser();
    return (
        <div className="text-start">
            <section className="flex flex-col items-center py-8">
                <UserAvatar imageUrl={groupChatData.imageUrl} size={100} />
                <p className="text-lg font-semibold mt-2">{groupChatData.name}</p>
            </section>

            <Separator className="bg-foreground/40" />

            <section className="p-5">
                <p className="text-sm text-foreground/80">{groupChatData.about}</p>
            </section>

            <Separator className="bg-foreground/40" />
            <section className="p-5">
                <p className="text-xs text-foreground/40 font-semibold">{groupChatData.members.length} Members</p>
                <div className="mt-5 space-y-4">
                    {groupChatData.members
                        .map((member) => (
                            <MembersList
                                key={member.id}
                                name={member.displayName}
                                imageUrl={member.imageUrl!}
                                username={member.username!}
                            />
                        ))}
                </div>
            </section>

            <Separator className="bg-foreground/40 mb-5" />
            <section className="mt-6 px-2">
                <div onClick={() => exitGroup(user?.id!)}
                    className="bg-red-500/10 text-center p-3 rounded-md cursor-pointer hover:bg-red-500/20 transition">
                    <span className="text-red-500 font-semibold">Exit Group</span>
                </div>
            </section>
        </div>
    );
}

interface MembersListProps {
    name: string;
    imageUrl: string;
    username: string
}

function MembersList({
    name,
    imageUrl,
    username,
}: MembersListProps) {
    return (
        <div className="flex items-center justify-between bg-foreground/5 p-3 rounded-md">
            <div className="flex items-center space-x-4">
                <UserAvatar imageUrl={imageUrl} />
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{name}</span>
                    <span className="text-xs text-foreground/40">@{username}</span>
                </div>
            </div>
            <span className="text-xs text-primary font-medium">Admin</span>
        </div>
    );
}
