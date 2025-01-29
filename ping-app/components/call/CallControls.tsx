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
            const audioTrack = localStream.current.getAudioTracks()[0];

            if (callType === "video" && videoTrack) {
                setIsCameraOn(videoTrack.enabled);
            }
            if (audioTrack) {
                setIsMicOn(audioTrack.enabled);
            }
        }
    }, [callType, localStream.current]);

    const toggleCamera = useCallback(() => {
        if (localStream.current) {
            const videoTrack = localStream.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsCameraOn(videoTrack.enabled);
            }
        }
    }, []);

    const toggleMic = useCallback(() => {
        if (localStream.current) {
            const audioTrack = localStream.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMicOn(audioTrack.enabled);
            }
        }
    }, []);

    const toggleSpeaker = () => setIsSpeakerOn(prev => !prev);

    const switchCamera = async () => {
        if (!localStream.current) return;

        const videoTracks = localStream.current.getVideoTracks();
        if (videoTracks.length === 0) return;

        const currentTrack = videoTracks[0];
        const constraints = currentTrack.getConstraints();

        // Toggle between front and back camera
        const newFacingMode = constraints.facingMode === "user" ? "environment" : "user";

        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: newFacingMode },
                audio: true,
            });

            localStream.current.getTracks().forEach(track => track.stop());
            localStream.current = newStream;
        } catch (error) {
            console.error("Error switching camera:", error);
        }
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
