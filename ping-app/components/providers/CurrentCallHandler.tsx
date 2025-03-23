"use client";

import { useEffect, useState } from "react";
import { useSocketContext } from "./socketProvider";
import { User } from "@prisma/client";
import { getUserById } from "@/actions/user/getUserById";
import IncomingCall from "../call/IncomingCall";
import OutgoingCall from "../call/OutgoingCall";

export default function CurrentCallHandler() {
    const [user, setUser] = useState<User | null>(null);
    const { currentCall, callState } = useSocketContext();

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

    if (currentCall.type === "VIDEO") {
        if (currentCall.from === user?.id && callState === "incoming") {
            return <IncomingCall
                type={currentCall.type}
                user={user!}
            />
        } return null;
    }

    if (currentCall.type === "VOICE") {
        if (currentCall.from === user?.id && callState === "incoming") {
            return <IncomingCall
                type={currentCall.type}
                user={user!}
            />
        }
        if (callState === "ringing") {
            return <OutgoingCall user={user!} />
        }
    }
}
