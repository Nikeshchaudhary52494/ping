"use client"

import { CallScreen } from "@/components/call/CallScreen";
import { useSocketContext } from "../providers/socketProvider";
import { useEffect, useState } from "react";
import { getUserById } from "@/actions/user/getUserById";
import { User } from "@prisma/client";

export default function Call() {
    const [user, setUser] = useState<User | null>(null);
    const { currentCall } = useSocketContext();

    useEffect(() => {
        const fetchUser = async () => {
            if (currentCall?.from) {
                const fetchedUser = await getUserById(currentCall.from);
                setUser(fetchedUser);
            }
        };

        fetchUser();
    }, [currentCall?.from]);
    return (
        <CallScreen
            callType={currentCall?.type!}
            remoteParticipantName={user?.displayName!}
            remoteUserId={user?.id!}
        />
    )
}

