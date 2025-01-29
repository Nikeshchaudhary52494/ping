import { useEffect, useRef } from "react";
import clsx from "clsx";

interface VideoContainerProps {
    stream: MediaStream | null;
    isLocalStream: boolean;
    className?: string;
}

export default function VideoContainer({
    stream,
    isLocalStream,
    className = "",
}: VideoContainerProps) {
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
