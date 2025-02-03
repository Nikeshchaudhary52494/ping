import { HeaderProfile } from "./HeaderProfile";
import { ActionButtons } from "./ActionButtons";
import { UserTab } from "@/types/prisma";

interface SectionHeaderProps {
    receiver: UserTab,
    CurrectUser: UserTab
}

export default function SectionHeader({
    receiver,
    CurrectUser
}: SectionHeaderProps) {

    return (
        <div className="w-full flex items-center justify-between px-4 sm:border-l-[1px] h-full border-slate-200 border-opacity-10 bg-[#1E1F22]">
            <HeaderProfile
                user={receiver || CurrectUser}
                isCurrentUser={!receiver}
            />
            <ActionButtons
                currentUserId={CurrectUser?.id}
                recipientId={receiver?.id}
            />
        </div>
    );
}