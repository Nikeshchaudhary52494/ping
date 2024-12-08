"use client";

import { CallControls } from "./CallControls";
import { useSocketContext } from "../providers/socketProvider";

interface CallScreenProps {
    callType: "video" | "voice";
    remoteParticipantName: string;
}

export function CallScreen({ callType, remoteParticipantName }: CallScreenProps) {

    const { socket, currentCall, setShowCallScreen, showCallScreen } = useSocketContext();

    const handleEndCall = () => {

        console.log("Ende acall")
        setShowCallScreen(false);
        socket?.emit('call:end', {
            ...currentCall
        })
    };

    if (!showCallScreen) return null;

    return (
        <div className="fixed inset-0 bg-background">
            {callType === "video" ? (
                <div className="relative h-full">
                    {/* Main video stream (remote participant) */}
                    <div className="flex items-center justify-center h-full bg-muted">
                        <p className="text-muted-foreground">Remote Video Stream</p>
                    </div>

                    {/* Local video preview */}
                    <div className="absolute w-32 h-48 overflow-hidden rounded-lg shadow-lg top-4 right-4 bg-accent">
                        <div className="flex items-center justify-center h-full">
                            <p className="text-xs text-muted-foreground">Local Preview</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 rounded-full bg-accent">
                            <span className="text-2xl font-semibold">
                                {remoteParticipantName?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <h2 className="text-xl font-semibold">{remoteParticipantName}</h2>
                        <p className="text-muted-foreground">Voice Call</p>
                    </div>
                </div>
            )}

            <CallControls
                callType={callType}
                onEndCall={handleEndCall}
            />
        </div>
    );
}