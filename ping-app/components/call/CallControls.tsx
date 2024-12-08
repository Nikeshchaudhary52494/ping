"use client";

import { useState } from "react";
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
    onEndCall: () => void;
}

export function CallControls({ callType, onEndCall }: CallControlsProps) {
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);

    const toggleCamera = () => setIsCameraOn(!isCameraOn);
    const toggleMic = () => setIsMicOn(!isMicOn);
    const toggleSpeaker = () => setIsSpeakerOn(!isSpeakerOn);
    const switchCamera = () => {
        // Implementation for switching between front/back camera
        console.log("Switching camera");
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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