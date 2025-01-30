import { useEffect, useRef } from "react";

interface AudioContainerProps {
    stream: MediaStream | null;
}

const AudioContainer: React.FC<AudioContainerProps> = ({ stream }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (stream && audioRef.current) {
            audioRef.current.srcObject = stream;
            audioRef.current.play().catch(error => console.error("Audio play failed:", error));
        }
    }, [stream, audioRef.current]);

    return <audio ref={audioRef} autoPlay playsInline />;
};

export default AudioContainer;
