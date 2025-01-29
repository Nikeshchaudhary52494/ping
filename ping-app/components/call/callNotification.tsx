import { CallState } from "@/types/socket";
import { useEffect, useRef } from "react";


export default function CallNotification({ callState }: {
    callState: CallState
}) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Map call states to corresponding audio files
    const soundMap: Record<string, string> = {
        ringing: "/ringing.mp3",
        incoming: "/incoming.mp3",
        linebusy: "/linebusy.mp3",
        ended: "/ended.mp3",
    };

    useEffect(() => {
        if (soundMap[callState]) {
            if (!audioRef.current) {
                audioRef.current = new Audio(soundMap[callState]);
                audioRef.current.loop = callState === "ringing" || callState === "incoming"; // Loop only for ringing & outgoing
            }
            audioRef.current.play();
        } else {
            audioRef.current?.pause();
            audioRef.current = null; // Reset when call ends
        }

        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, [callState]);

    return null;
};
