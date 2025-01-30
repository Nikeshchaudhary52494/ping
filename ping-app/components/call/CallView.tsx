"use client";
import { useSocketContext } from "../providers/socketProvider";
import CallAlert from "./CallAlert";
import VideoCallHandler from "./VideoCallHandler";
import CallController from "./CallController";
import AudioCallHandler from "./AudioCallHandler";

interface CallViewProps {
    callType: "video" | "voice";
    remoteParticipantName: string;
    remoteUserId: string;
}

export default function CallView({
    callType,
    remoteParticipantName,
    remoteUserId
}: CallViewProps) {

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
        if (callState === "ringing") {
            setCallState("dropped");
            socket?.emit("call:drop", {
                to: remoteUserId,
            });
        } else {
            setCallState("ended");
            socket?.emit("call:end", {
                roomId: currentCall?.roomId,
                from: currentCall?.from,
                to: remoteUserId,
            });
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
    };

    if (callState === "accepted" || (callState === "ringing" && currentCall?.type === "video")) {

        console.log("videoref", { localStreamRef, remoteStreamRef });

        return (
            <div className="h-full">

                <CallAlert callState={callState} />

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
                                        <VideoCallHandler
                                            className="object-cover h-full aspect-video"
                                            stream={localStreamRef}
                                            isLocalStream={true}
                                        />
                                    </>
                                ) : (
                                    <VideoCallHandler
                                        className="object-cover h-full aspect-video"
                                        stream={remoteStreamRef}
                                        isLocalStream={false}
                                    />
                                )}
                            </div>
                            {callState === "accepted" && (
                                <div className="absolute w-32 h-48 overflow-hidden rounded-lg shadow-lg top-4 right-4 bg-accent">
                                    <VideoCallHandler
                                        className="object-cover h-full"
                                        stream={localStreamRef}
                                        isLocalStream={true}
                                    />
                                </div>
                            )}
                        </div>

                        <CallController
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
                            <AudioCallHandler stream={remoteStreamRef.current} />
                        )}
                        <CallController
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
