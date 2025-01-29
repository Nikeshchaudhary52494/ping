"use client";

import { MutableRefObject, useCallback, useEffect, useState } from "react";
import {
    Camera,
    CameraOff,
    Mic,
    MicOff,
    Phone,
    RefreshCw,
    Volume2,
    VolumeX,
} from "lucide-react";
import { CallButton } from "./callButton";

interface CallControlsProps {
    callType: "video" | "voice";
    localStream: MutableRefObject<MediaStream | null>;
    onEndCall: () => void;
}

export function CallControls({
    callType,
    onEndCall,
    localStream
}: CallControlsProps) {

    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);

    useEffect(() => {
        if (localStream.current) {
            const videoTrack = localStream.current.getVideoTracks()[0];
            setIsCameraOn(videoTrack.enabled);

            const audioTrack = localStream.current.getAudioTracks()[0];
            setIsMicOn(audioTrack.enabled);
        }
    }, [localStream])

    const toggleCamera = useCallback(() => {
        if (localStream.current) {
            const videoTrack = localStream.current.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled
            setIsMicOn(videoTrack.enabled);
        }
    }, [localStream]);

    const toggleMic = useCallback(() => {
        if (localStream.current) {
            const audioTrack = localStream.current.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled
            setIsCameraOn(audioTrack.enabled);
        }
    }, [localStream]);

    const toggleSpeaker = () => setIsSpeakerOn(!isSpeakerOn);
    const switchCamera = () => {
        // Implementation for switching between front/back camera
        console.log("Switching camera");
    };

    return (
        <div className="bg-background/95">
            <div className="container max-w-md p-4 mx-auto">
                <div className="flex items-center justify-center gap-6">
                    {callType === "video" && (
                        <>
                            <CallButton
                                icon={isCameraOn ? Camera : CameraOff}
                                onClick={toggleCamera}
                                active={isCameraOn}
                            />
                            <CallButton
                                icon={RefreshCw}
                                onClick={switchCamera}
                            />
                        </>
                    )}

                    <CallButton
                        icon={isMicOn ? Mic : MicOff}
                        onClick={toggleMic}
                        active={isMicOn}
                    />

                    <CallButton
                        icon={isSpeakerOn ? Volume2 : VolumeX}
                        onClick={toggleSpeaker}
                        active={isSpeakerOn}
                    />

                    <CallButton
                        icon={Phone}
                        onClick={onEndCall}
                        variant="destructive"
                    />
                </div>
            </div>
        </div>
    );
}