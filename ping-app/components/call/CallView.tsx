"use client";
import { useSocketContext } from "../providers/socketProvider";
import CallAlert from "./CallAlert";
import VideoCallHandler from "./VideoCallHandler";
import CallController from "./CallController";
import AudioCallHandler from "./AudioCallHandler";
import { CallType } from "@prisma/client";
import { useRouter } from "next/navigation";

interface CallViewProps {
    callType: CallType;
    remoteParticipantName: string;
    remoteUserId: string;
}

export default function CallView({
    callType,
    remoteParticipantName,
    remoteUserId
}: CallViewProps) {

    const router = useRouter();

    const {
        socket,
        currentCall,
        localStream,
        setLocalStream,
        remoteStream,
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
            router.push("/calls");
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        localStream?.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
    };

    if (callState === "accepted" || (callState === "ringing" && currentCall?.type === "VIDEO")) {

        console.log("videoref", { localStream, remoteStream });

        return (
            <div className="h-full">

                <CallAlert callState={callState} />

                {callType === "VIDEO" ? (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 h-20 m-2 rounded-lg">
                            <div className="flex items-center justify-center h-full mx-auto overflow-hidden bg-transparent rounded-lg w-fit">
                                {callState === "ringing" ? (
                                    <>
                                        <div className="absolute z-10 px-4 py-2 text-center text-white transform -translate-x-1/2 rounded-lg top-20 left-1/2 bg-black/30 backdrop-blur-sm">
                                            <h2 className="text-xl font-semibold">{remoteParticipantName}</h2>
                                            <p className="text-sm text-gray-300">Ringing...</p>
                                        </div>
                                        <VideoCallHandler
                                            className="object-cover h-full aspect-video"
                                            stream={localStream}
                                            isLocalStream={true}
                                        />
                                    </>
                                ) : (
                                    <VideoCallHandler
                                        className="object-cover h-full aspect-video"
                                        stream={remoteStream}
                                        isLocalStream={false}
                                    />
                                )}
                            </div>
                            {callState === "accepted" && (
                                <div className="absolute w-32 h-48 overflow-hidden rounded-lg shadow-lg top-4 right-4 bg-[#1E1F22]">
                                    <VideoCallHandler
                                        className="object-cover h-full"
                                        stream={localStream}
                                        isLocalStream={true}
                                    />
                                </div>
                            )}
                        </div>

                        <CallController
                            remoteStream={remoteStream}
                            localStream={localStream}
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
                        {callType === "VOICE" && callState === "accepted" && (
                            <AudioCallHandler stream={remoteStream} />
                        )}
                        <CallController
                            remoteStream={remoteStream}
                            localStream={localStream}
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
