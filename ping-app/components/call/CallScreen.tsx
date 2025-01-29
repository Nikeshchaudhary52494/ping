"use client";

import { useEffect, useRef } from "react";
import { CallControls } from "./CallControls";
import { useSocketContext } from "../providers/socketProvider";
import VideoContainer from "./VideoContainer";
import CallNotification from "./callNotification";

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

    if (callState === "accepted" || (callState === "ringing" && currentCall?.type === "video")) {

        return (
            <div className="h-full">
                <CallNotification callState={callState} />
                {
                    callType === "video"
                        ? (
                            <div className="flex flex-col h-full">
                                <div className="flex-1 h-20 m-2 rounded-lg">
                                    <div className="flex items-center justify-center h-full mx-auto overflow-hidden rounded-lg w-fit bg-muted">
                                        {
                                            callState === "ringing" ?
                                                (
                                                    <>
                                                        <div className="absolute z-10 px-4 py-2 text-center text-white transform -translate-x-1/2 rounded-lg top-20 left-1/2 bg-black/30 backdrop-blur-sm">
                                                            <h2 className="text-xl font-semibold">{remoteParticipantName}</h2>
                                                            <p className="text-sm text-gray-300">Ringing...</p>
                                                        </div>

                                                        < VideoContainer
                                                            className="object-cover h-full aspect-video"
                                                            stream={localStreamRef.current}
                                                            isLocalStream={true}
                                                        />
                                                    </>

                                                ) : (
                                                    < VideoContainer
                                                        className="object-cover h-full aspect-video"
                                                        stream={remoteStream}
                                                        isLocalStream={false}
                                                    />
                                                )
                                        }
                                    </div>
                                    {
                                        callState === "accepted" && (<div className="absolute w-32 h-48 overflow-hidden rounded-lg shadow-lg top-4 right-4 bg-accent">

                                            <VideoContainer
                                                className="object-cover h-full"
                                                stream={localStreamRef.current}
                                                isLocalStream={true}
                                            />

                                        </div>
                                        )
                                    }
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
