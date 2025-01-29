"use client";

import { CallScreen } from "@/components/call/CallScreen";
import { useSocketContext } from "../providers/socketProvider";
import { useEffect, useState } from "react";
import { getUserById } from "@/actions/user/getUserById";
import { User } from "@prisma/client";
import { useUser } from "../providers/userProvider";

export default function Call() {
    const [user, setUser] = useState<User | null>(null);
    const { currentCall } = useSocketContext();
    const { user: currentUser } = useUser();

    useEffect(() => {
        if (!currentCall || !currentUser) return;

        const fetchUser = async () => {
            try {
                const userId = currentCall.from === currentUser.id ? currentCall.to : currentCall.from;
                if (!userId) return;

                const fetchedUser = await getUserById(userId);
                setUser(fetchedUser);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        fetchUser();
    }, [currentCall, currentUser]);

    return (
        <CallScreen
            callType={currentCall?.type!}
            remoteParticipantName={user?.displayName!}
            remoteUserId={user?.id!}
        />
    );
}
