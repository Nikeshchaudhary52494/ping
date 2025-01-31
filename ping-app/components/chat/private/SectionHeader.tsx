import { getUser } from "@/actions/user/getUser";
import { db } from "@/lib/db";
import { HeaderProfile } from "./HeaderProfile";
import { ActionButtons } from "./ActionButtons";

interface SectionHeaderProps {
    params: {
        privateChatId?: string;
        groupChatId?: string;
    }
}

export default async function SectionHeader({ params }: SectionHeaderProps) {
    const privateChat = await db.chat.findUnique({
        where: {
            id: params.privateChatId?.toString(),
        },
        include: {
            members: true
        },
    });

    const { user } = await getUser();

    if (!user) {
        return null;
    }

    const secondPerson = privateChat?.members?.find(
        (member) => member.id !== user.id
    );

    return (
        <div className="w-full flex items-center justify-between px-4 sm:border-l-[1px] h-full border-slate-200 border-opacity-10 bg-[#1E1F22]">
            <HeaderProfile
                user={secondPerson || user}
                isCurrentUser={!secondPerson}
            />
            <ActionButtons
                currentUserId={user.id}
                recipientId={secondPerson?.id!}
            />
        </div>
    );
}