import { HeaderProfile } from "./HeaderProfile";
import { ActionButtons } from "./ActionButtons";
import { User } from "@prisma/client";
import { useUser } from "@/components/providers/userProvider";

interface SectionHeaderProps {
    members: User[]
}

export default function SectionHeader({ members }: SectionHeaderProps) {

    const { user } = useUser();

    const secondPerson = members?.find(
        (member) => member.id !== user?.id
    );

    return (
        <div className="w-full flex items-center justify-between px-4 sm:border-l-[1px] h-full border-slate-200 border-opacity-10 bg-[#1E1F22]">
            <HeaderProfile
                user={secondPerson! || user}
                isCurrentUser={!secondPerson}
            />
            <ActionButtons
                currentUserId={user?.id!}
                recipientId={secondPerson?.id!}
            />
        </div>
    );
}