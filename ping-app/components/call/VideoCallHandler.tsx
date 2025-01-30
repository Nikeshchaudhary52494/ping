import { useEffect, useRef } from "react";
import clsx from "clsx";

interface VideoCallHandlerProps {
    stream: MediaStream | null;
    isLocalStream: boolean;
    className?: string;
}

export default function VideoCallHandler({
    stream,
    isLocalStream,
    className = "",
}: VideoCallHandlerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.style.transform = 'scaleX(-1)';
        }
    }, [stream]);

    return (
        <video
            ref={videoRef}
            autoPlay
            muted={isLocalStream}
            playsInline
            className={clsx(className)}
        />
    );
}
