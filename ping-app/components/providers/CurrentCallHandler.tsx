"use client";

import { useEffect, useState } from "react";
import IncomingCall from "../call/IncomingCallModal";
import { useSocketContext } from "./socketProvider";
import { User } from "@prisma/client";
import { getUserById } from "@/actions/user/getUserById";
import MakeCall from "../call/MakeCall";

export default function CurrentCallHandler() {
    const [user, setUser] = useState<User | null>(null);
    const { currentCall, callState } = useSocketContext();
    console.log({ callState, currentCall });

    useEffect(() => {
        const fetchUser = async () => {
            if (currentCall && callState === "incoming") {
                const fetchedUser = await getUserById(currentCall.from);
                setUser(fetchedUser);
            }
        };

        fetchUser();
    }, [currentCall, callState]);

    useEffect(() => {
        const fetchUser = async () => {
            if (currentCall && callState == "ringing") {
                const fetchedUser = await getUserById(currentCall.to);
                setUser(fetchedUser);
            }
        };

        fetchUser();
    }, [currentCall, callState]);

    if (!currentCall) return null;

    if (currentCall.type === "video") {
        if (currentCall.from === user?.id && callState === "incoming") {
            return <IncomingCall
                type={currentCall.type}
                user={user!}
            />
        } return null;
    }
} 