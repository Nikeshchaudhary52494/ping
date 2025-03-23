"use client"

import { UserAvatar } from "../user/UserAvatar";
import { useEffect, useState } from "react";
import { useUser } from "../providers/userProvider";
import getBlockedUsers from "@/actions/chat/privateChat/getBlockedUsers";
import unBlockUser from "@/actions/chat/privateChat/unBlockUser";
import { toast } from "@/app/hooks/use-toast";

interface BlockedUser {
    blocked: {
        id: string;
        displayName: string;
        username: string | null;
        imageUrl: string | null;
    };
}
export default function BlockedUsers() {

    const { user } = useUser();

    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);

    const handleUnblock = async (blockedId: string) => {
        const remainingUsers = await unBlockUser(user?.id!, blockedId);
        setBlockedUsers(remainingUsers);
        toast({
            description: "User unblocked",
        });
    };

    useEffect(() => {
        if (!user?.id) return;

        const fetchBlockedUsers = async () => {
            const users = await getBlockedUsers(user.id);
            setBlockedUsers(users || []);
        };

        fetchBlockedUsers();
    }, [user?.id]);

    return (
        <div className="flex flex-col items-start p-10 space-y-6">
            <div>
                <h2 className="text-3xl font-bold">Manage Blocked Users</h2>
                <p className="text-foreground/40">click profile to unblock Usser</p>
            </div>
            {blockedUsers?.length === 0 ? (
                <p className="text-muted-foreground">No blocked users.</p>
            ) : (
                <div className="space-y-4 grid w-full grid-cols-3">
                    {blockedUsers?.map(({ blocked }) => (
                        <div
                            key={blocked.id}
                            onClick={() => { handleUnblock(blocked.id) }}
                            className="flex items-center group w-full hover:bg-secondary duration-200 justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <UserAvatar className="group-hover:bg-background duration-200 bg-secondary rounded-full" imageUrl={blocked.imageUrl} />
                                <div>
                                    <p className="font-medium">{blocked.displayName}</p>
                                    <p className="text-sm text-muted-foreground">@{blocked.username}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
