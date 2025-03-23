"use client";

import { useCallback, useEffect, useState } from "react";
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
import CallControllerButton from "./CallControllerButton";
import { CallType } from "@prisma/client";

interface CallControllerProps {
    callType: CallType;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    onEndCall: () => void;
}

export default function CallController({
    callType,
    onEndCall,
    localStream,
    remoteStream,
}: CallControllerProps) {
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);

    useEffect(() => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            const audioTrack = localStream.getAudioTracks()[0];

            if (callType === "VIDEO" && videoTrack) setIsCameraOn(videoTrack.enabled);
            if (audioTrack) setIsMicOn(audioTrack.enabled);
        }
    }, [callType, localStream]);

    const toggleCamera = useCallback(() => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsCameraOn(videoTrack.enabled);
            }
        }
    }, [localStream]);

    const toggleMic = useCallback(() => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMicOn(audioTrack.enabled);
            }
        }
    }, [localStream]);

    const toggleSpeaker = () => {
        if (remoteStream) {
            const audioTracks = remoteStream.getAudioTracks();
            audioTracks.forEach((track) => (track.enabled = !track.enabled));
            setIsSpeakerOn((prev) => !prev);
        }
    };

    const switchCamera = async () => {
        if (!localStream) return;

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === "videoinput");

            if (videoDevices.length < 2) {
                console.warn("Only one camera available.");
                return;
            }

            const currentFacingMode = localStream
                .getVideoTracks()[0]
                .getSettings().facingMode;

            const newFacingMode = currentFacingMode === "user" ? "environment" : "user";

            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: newFacingMode },
                audio: true,
            });

            const oldTracks = localStream.getTracks();
            oldTracks.forEach((track) => track.stop());

            localStream = newStream;
        } catch (error) {
            console.error("Error switching camera:", error);
        }
    };

    return (
        <div className="flex justify-center gap-6 p-4 border-l border-secondary-foreground/10 bg-secondary">
            {callType === "VIDEO" && (
                <>
                    <CallControllerButton
                        icon={isCameraOn ? Camera : CameraOff}
                        onClick={toggleCamera}
                        active={isCameraOn}
                    />

                    <CallControllerButton
                        icon={RefreshCw}
                        onClick={switchCamera}
                    />
                </>
            )}
            <CallControllerButton
                icon={isMicOn ? Mic : MicOff}
                onClick={toggleMic}
                active={isMicOn}
            />

            <CallControllerButton
                icon={isSpeakerOn ? Volume2 : VolumeX}
                onClick={toggleSpeaker}
                active={isSpeakerOn}
            />

            <CallControllerButton
                icon={Phone}
                onClick={onEndCall}
                variant="destructive"
            />
        </div>
    );
}