"use client";

import { MutableRefObject, useEffect, useState } from "react";
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

interface CallControllerProps {
    callType: "video" | "voice";
    localStream: MutableRefObject<MediaStream | null>;
    remoteStream: MutableRefObject<MediaStream | null>;
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
        if (localStream.current) {
            const videoTrack = localStream.current.getVideoTracks()[0];
            const audioTrack = localStream.current.getAudioTracks()[0];

            if (callType === "video" && videoTrack) setIsCameraOn(videoTrack.enabled);
            if (audioTrack) setIsMicOn(audioTrack.enabled);
        }
    }, [callType, localStream]);

    const toggleCamera = () => {
        if (localStream.current) {
            const videoTrack = localStream.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsCameraOn(videoTrack.enabled);
            }
        }
    };

    const toggleMic = () => {
        if (localStream.current) {
            const audioTrack = localStream.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMicOn(audioTrack.enabled);
            }
        }
    };

    const toggleSpeaker = () => {
        if (remoteStream.current) {
            const audioTracks = remoteStream.current.getAudioTracks();
            audioTracks.forEach((track) => (track.enabled = !track.enabled));
            setIsSpeakerOn((prev) => !prev);
        }
    };

    const switchCamera = async () => {
        if (!localStream.current) return;

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === "videoinput");

            if (videoDevices.length < 2) {
                console.warn("Only one camera available.");
                return;
            }

            const currentFacingMode = localStream.current
                .getVideoTracks()[0]
                .getSettings().facingMode;

            const newFacingMode = currentFacingMode === "user" ? "environment" : "user";

            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: newFacingMode },
                audio: true,
            });

            const oldTracks = localStream.current.getTracks();
            oldTracks.forEach((track) => track.stop());

            localStream.current = newStream;
        } catch (error) {
            console.error("Error switching camera:", error);
        }
    };

    return (
        <div className="flex justify-center gap-6 p-4 bg-background/95">
            {callType === "video" && (
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