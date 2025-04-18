import { blockUser } from "@/actions/chat/privateChat/blockUser";
import { useUser } from "../providers/userProvider";
import { Separator } from "../ui/separator";
import { UserAvatar } from "../user/UserAvatar";
import { useState } from "react";
import unBlockUser from "@/actions/chat/privateChat/unBlockUser";

interface UserDetailsProps {
    name: string;
    username: string;
    bio: string;
    imageUrl: string;
    userId: string
}

export function UserDetails({
    name,
    username,
    bio,
    imageUrl,
    userId
}: UserDetailsProps) {

    const { user: currentUser } = useUser();

    const handleBlockUser = async () => {
        await blockUser(userId, currentUser?.id!);
        setUserBlocked(true);
    }
    const handleUnblockUser = async () => {
        await unBlockUser(currentUser?.id!, userId);
        setUserBlocked(false)
    }
    const isUserBlocked = currentUser?.blockedContacts.some(contact => contact.blockedId === userId) ?? false;

    const [userBlocked, setUserBlocked] = useState<boolean>(isUserBlocked)

    return (
        <div className="text-start">
            <section className="flex flex-col items-center py-8">
                <UserAvatar imageUrl={imageUrl} size={100} />
                <p className="text-lg font-semibold mt-2">{name}</p>
                <span className="text-sm text-foreground/40">@{username}</span>
            </section>

            <Separator className="bg-foreground/40" />

            <section className="p-5">
                <p className="text-sm text-foreground/80">{bio}</p>
            </section>
            <Separator className="bg-foreground/40 mb-5" />
            <section className="mt-6 px-2">
                {
                    userBlocked ? (
                        <div
                            onClick={handleUnblockUser}
                            className="bg-red-500/10 text-center p-3 rounded-md cursor-pointer hover:bg-red-500/20 transition">
                            <span className="text-red-500 font-semibold">Unblock user</span>
                        </div>
                    ) : (
                        <div
                            onClick={() => handleBlockUser()}
                            className="bg-red-500/10 text-center p-3 rounded-md cursor-pointer hover:bg-red-500/20 transition">
                            <span className="text-red-500 font-semibold">Block user </span>
                        </div>
                    )
                }
            </section>

        </div>
    );
}