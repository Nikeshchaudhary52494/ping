"use client";

import { useEffect } from "react";
import { CallControls } from "./CallControls";
import { useSocketContext } from "../providers/socketProvider";
import VideoContainer from "./VideoContainer";

interface CallScreenProps {
    callType: "video" | "voice";
    remoteParticipantName: string;
    remoteUserId: string;
}

export function CallScreen({
    callType,
    remoteParticipantName,
    remoteUserId,
}: CallScreenProps) {
    const {
        socket,
        currentCall,
        localStreamRef,
        remoteStream,
        peerConnectionRef,
        callState,
        setCallState

    } = useSocketContext();

    const handleEndCall = () => {
        setCallState("ended");

        // Clean up peer connection and streams
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

    console.log("ksvkfnvknfsk", { remoteStream });



    useEffect(() => {
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
        if (currentCall) {
            startLocalStream();
        }
        return () => {
            localStreamRef.current?.getTracks().forEach((track) => track.stop());
        };
    }, [currentCall?.type]);

    console.log({ localStreamRef });
    console.log({ remoteStream })

    if (callState === "accepted" || callState === "ringing") {

        return (
            <div className="h-full">
                {
                    callType === "video"
                        ? (
                            <div className="flex flex-col h-full">
                                <div className="flex-1 h-20 m-2 rounded-lg">
                                    <div className="flex items-center justify-center h-full mx-auto overflow-hidden rounded-lg w-fit bg-muted">
                                        <VideoContainer
                                            className="object-cover h-full aspect-video"
                                            stream={remoteStream}
                                            isLocalStream={false}
                                        />
                                    </div>
                                    <div className="absolute w-32 h-48 overflow-hidden rounded-lg shadow-lg top-4 right-4 bg-accent">
                                        <VideoContainer
                                            className="object-cover h-full"
                                            stream={localStreamRef.current}
                                            isLocalStream={true}
                                        />
                                    </div>
                                </div>
                                <CallControls
                                    localStream={localStreamRef}
                                    callType={callType}
                                    onEndCall={handleEndCall} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 rounded-full bg-accent">
                                        <span className="text-2xl font-semibold">
                                            {remoteParticipantName?.charAt(0).toUpperCase()}
                                        </span>
                                    </div >
                                    <h2 className="text-xl font-semibold">{remoteParticipantName}</h2>
                                    <p className="text-muted-foreground">
                                        {callState === "accepted" ? "Voice Call" : "Connecting..."}
                                    </p>
                                </div >
                                <CallControls
                                    localStream={localStreamRef}
                                    callType={callType}
                                    onEndCall={handleEndCall} />
                            </div >
                        )}
            </div >
        );
    }
    return null;
}
