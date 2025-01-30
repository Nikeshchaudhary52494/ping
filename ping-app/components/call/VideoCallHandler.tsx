import { MutableRefObject, useEffect, useRef } from "react";
import clsx from "clsx";

interface VideoCallHandlerProps {
    stream: MutableRefObject<MediaStream | null>;
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
        const video = videoRef.current;
        if (video && stream.current) {
            video.srcObject = stream.current;
            video.style.transform = 'scaleX(-1)';

            // Ensure the video plays after setting srcObject
            video.onloadedmetadata = () => {
                video.play().catch(error => console.error("Error playing video:", error));
            };
        }
    }, [stream.current]);

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
