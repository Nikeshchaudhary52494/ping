import { CallState } from "@/types/socket";
import { useEffect, useRef, useMemo } from "react";

export default function CallAlert({ callState }: { callState: CallState }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const soundMap: Partial<Record<CallState, string>> = useMemo(() => ({
        ringing: "/ringing.mp3",
        incoming: "/incoming.mp3",
        linebusy: "/linebusy.mp3",
        ended: "/ended.mp3",
    }), []);

    useEffect(() => {
        const soundUrl = soundMap[callState];

        if (soundUrl) {
            if (!audioRef.current) {
                audioRef.current = new Audio(soundUrl);
                audioRef.current.loop = callState === "ringing" || callState === "incoming";
            }
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Audio playback interrupted (expected if call state changed quickly).");
                });
            }
        } else {
            audioRef.current?.pause();
            audioRef.current = null;
        }

        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, [callState, soundMap]);

    return null;
}
