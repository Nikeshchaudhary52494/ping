"use client";

import { useEffect, useState } from "react";
import IncomingCall from "../call/IncomingCallModal";
import { useSocketContext } from "./socketProvider";
import { User } from "@prisma/client";
import { getUserById } from "@/actions/user/getUserById";
import MakeCall from "../call/MakeCall";

export default function CurrentCallHandler() {
    const [user, setUser] = useState<User | null>(null);
    const { currentCall, calling, isCallAccepted } = useSocketContext();

    useEffect(() => {
        const fetchUser = async () => {
            if (currentCall?.from) {
                const fetchedUser = await getUserById(currentCall.from);
                setUser(fetchedUser);
            }
        };

        fetchUser();
    }, [currentCall?.from]);

    useEffect(() => {
        const fetchUser = async () => {
            if (calling) {
                const fetchedUser = await getUserById(calling);
                setUser(fetchedUser);
            }
        };

        fetchUser();
    }, [calling]);

    if (!currentCall && !calling) return null;

    if (!calling && !isCallAccepted) return <IncomingCall
        type={currentCall?.type!}
        user={user!}
    />

    return !isCallAccepted && <MakeCall user={user!} />
} 