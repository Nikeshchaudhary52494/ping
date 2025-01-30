import { useEffect, useRef } from "react";

interface AudioCallHandlerProps {
    stream: MediaStream | null;
}

export default function AudioCallHandler({
    stream
}: AudioCallHandlerProps) {

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (stream && audioRef.current) {
            audioRef.current.srcObject = stream;
            audioRef.current.play().catch(error => console.error("Audio play failed:", error));
        }
    }, [stream]);

    return <audio ref={audioRef} autoPlay playsInline />;
};