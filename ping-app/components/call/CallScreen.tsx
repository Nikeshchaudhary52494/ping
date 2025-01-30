"use client";

import { useEffect } from "react";
import { CallControls } from "./CallControls";
import { useSocketContext } from "../providers/socketProvider";
import VideoContainer from "./VideoContainer";
import CallNotification from "./CallNotification";
import AudioContainer from "./AudioContainer";

interface CallScreenProps {
    callType: "video" | "voice";
    remoteParticipantName: string;
    remoteUserId: string;
}

export function CallScreen({
    callType,
    remoteParticipantName,
    remoteUserId
}: CallScreenProps) {

    const {
        socket,
        currentCall,
        localStreamRef,
        remoteStreamRef,
        peerConnectionRef,
        callState,
        setCallState
    } = useSocketContext();

    const handleEndCall = () => {
        setCallState("ended");

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;

        socket?.emit("call:end", {
            roomId: currentCall?.roomId,
            from: currentCall?.from,
            to: remoteUserId,
        });
    };

    useEffect(() => {
        if (!currentCall || callState == "ended" || callState == "rejected") return;

        const startLocalStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: callType === "video",
                    audio: true,
                });
                localStreamRef.current = stream;

            } catch (error) {
                console.error("Failed to access media devices:", error);
            }
        };

        startLocalStream();

        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => track.stop());
                localStreamRef.current = null;
            }
        };
    }, [currentCall, callType]);

    if (callState === "accepted" || (callState === "ringing" && currentCall?.type === "video")) {

        console.log('********', { remoteStreamRef, localStreamRef })

        return (
            <div className="h-full">

                <CallNotification callState={callState} />

                {callType === "video" ? (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 h-20 m-2 rounded-lg">
                            <div className="flex items-center justify-center h-full mx-auto overflow-hidden rounded-lg w-fit bg-muted">
                                {callState === "ringing" ? (
                                    <>
                                        <div className="absolute z-10 px-4 py-2 text-center text-white transform -translate-x-1/2 rounded-lg top-20 left-1/2 bg-black/30 backdrop-blur-sm">
                                            <h2 className="text-xl font-semibold">{remoteParticipantName}</h2>
                                            <p className="text-sm text-gray-300">Ringing...</p>
                                        </div>
                                        <VideoContainer
                                            className="object-cover h-full aspect-video"
                                            stream={localStreamRef.current}
                                            isLocalStream={true}
                                        />
                                    </>
                                ) : (
                                    <VideoContainer
                                        className="object-cover h-full aspect-video"
                                        stream={remoteStreamRef.current}
                                        isLocalStream={false}
                                    />
                                )}
                            </div>
                            {callState === "accepted" && (
                                <div className="absolute w-32 h-48 overflow-hidden rounded-lg shadow-lg top-4 right-4 bg-accent">
                                    <VideoContainer
                                        className="object-cover h-full"
                                        stream={localStreamRef.current}
                                        isLocalStream={true}
                                    />
                                </div>
                            )}
                        </div>

                        <CallControls
                            remoteStream={remoteStreamRef}
                            localStream={localStreamRef}
                            callType={callType}
                            onEndCall={handleEndCall}
                        />

                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-center h-full">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex items-center justify-center w-24 h-24 mb-4 rounded-full bg-accent">
                                    <span className="text-2xl font-semibold">
                                        {remoteParticipantName?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <h2 className="text-xl font-semibold">{remoteParticipantName}</h2>
                                <p className="text-muted-foreground">Voice Call</p>
                            </div>
                        </div>
                        {callType === "voice" && callState === "accepted" && (
                            <AudioContainer stream={remoteStreamRef.current} />
                        )}
                        <CallControls
                            remoteStream={remoteStreamRef}
                            localStream={localStreamRef}
                            callType={callType}
                            onEndCall={handleEndCall}
                        />
                    </div>
                )}
            </div>
        );
    }
    return null;
}
