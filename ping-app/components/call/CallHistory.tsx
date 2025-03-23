"use client";

import { useCallback, useEffect, useState } from "react";
import { Video, PhoneCall, Redo } from "lucide-react";
import { Button } from "@/components/ui/button";
import getCallHistory from "@/actions/calls/getCallHistory";
import { useUser } from "../providers/userProvider";
import { CallStatus, CallType } from "@prisma/client";
import { useSocketContext } from "../providers/socketProvider";
import { toast } from "@/app/hooks/use-toast";
import { useRouter } from "next/navigation";
import { makeCall } from "@/actions/chat/privateChat/addCall";

interface CallHistory {
    id: string;
    callerId: string;
    receiverId: string;
    callStatus: CallStatus;
    callTime: Date;
    duration: string;
    callType: CallType;
    receiver: {
        displayName: string;
        username: string | null;
    };
    caller: {
        displayName: string;
        username: string | null;
    }
}


export default function CallHistory() {
    const [calls, setCalls] = useState<CallHistory[]>([]);

    const { user } = useUser();
    const { socket,
        setCurrentCall,
        setCallState,
        getMediaStream
    } = useSocketContext();

    useEffect(() => {
        if (!user) return;
        const fetchCallHistory = async () => {
            const callHistory = await getCallHistory(user?.id!); // Fetch call history
            setCalls(callHistory!); // Update state
        };

        fetchCallHistory();
    }, [user]);

    const router = useRouter();

    const initiateCall = useCallback(async (currentUserId: string, recipientId: string, type: CallType) => {
        if (!socket) {
            toast({
                title: "Connection Error",
                description: "Unable to connect to call service",
                variant: "destructive",
            });
            return;
        }
        const stream = await getMediaStream(type);
        if (!stream) {
            console.error("No stream Available while initiating call");
            return;
        }

        setCurrentCall({
            from: currentUserId,
            to: recipientId,
            type,
        })
        setCallState("ringing")

        if (type === "VIDEO") router.push("/calls/callScreen")

        socket.emit('call:initiate', {
            from: currentUserId,
            to: recipientId,
            type,
        });

        await makeCall(currentUserId, recipientId, type);
    }, [
        socket,
        router,
        setCallState,
        setCurrentCall,
        getMediaStream
    ]);

    // Function to initiate a call (placeholder)
    const handleRedial = (name: string, type: string) => {
        alert(`Calling ${name} via ${type} call...`);
    };


    return (
        <div className="max-w-lg p-10">
            <h2 className="mb-6 text-3xl font-bold">Call History</h2>

            <div className="space-y-4">
                {calls.map((call) => (
                    <div
                        key={call.id}
                        className="flex items-center justify-between p-4 transition-all duration-200 border rounded bg-secondary/40"
                    >
                        <div className="flex items-center gap-4">
                            {call.callType === "VIDEO" ? (
                                <Video className="text-blue-500" size={24} />
                            ) : (
                                <PhoneCall className="text-green-500" size={24} />
                            )}
                            <div>
                                <p>{call.caller.username === user?.username ? call.receiver.displayName : call.caller.displayName}</p>
                                <p className="text-xs text-primary">@{call.caller.username === user?.username ? call.receiver.username : call.caller.username}</p>
                                <p className="text-sm text-foreground/40">{formatTime(call.duration)}</p>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="flex items-center gap-2 px-4 py-2"
                            onClick={() => {
                                if (call.receiverId === user?.id) {
                                    initiateCall(user.id, call.callerId, call.callType)
                                } else {
                                    initiateCall(user?.id!, call.receiverId, call.callType)
                                }
                            }}
                        >
                            <Redo size={18} /> Redial
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Function to format time
function formatTime(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}