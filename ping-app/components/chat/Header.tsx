import { useUser } from "@/components/providers/userProvider";
import { UserAvatar } from "@/components/user/UserAvatar";
import Profile from "../skeletons/Profile";

export default function Header() {
    const { user, loading } = useUser()

    return (
        <div className="flex w-full gap-2 py-2 px-5 border-b border-secondary-foreground/10">
            {loading ? (
                <Profile />
            ) : (
                <>
                    <UserAvatar imageUrl={user?.imageUrl} />
                    <div className="flex flex-col">
                        <span>
                            {user?.displayName}
                        </span>
                        <span className="text-xs text-primary">
                            {`@${user?.username}`}
                        </span>
                    </div>
                </>
            )}
        </div >
    );
}
