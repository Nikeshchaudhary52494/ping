import { useUser } from "@/components/providers/userProvider";
import { UserAvatar } from "@/components/user/UserAvatar";

export default function Header() {
    const { user } = useUser()
    return (
        <div className="flex w-full gap-2 p-2 border-b-[1px] border-slate-200 border-opacity-10">
            <UserAvatar imageUrl={user?.imageUrl} />
            <div className="flex flex-col">
                <span>
                    {user?.displayName}
                </span>
                <span className="text-xs text-slate-400">
                    {`@${user?.username}`}
                </span>
            </div>
        </div>
    );
}
