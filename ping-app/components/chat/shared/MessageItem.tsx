"use client";

import { messageStatus } from "@prisma/client";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { IoCheckmarkDone, IoCheckmark } from "react-icons/io5";
import { CircleAlert } from "lucide-react";
import useScreenWidth from "@/app/hooks/useScreenWidth";

interface MessageItemProps {
    content: string;
    fileUrl?: string;
    isMine: boolean;
    createdAt: Date;
    status: messageStatus;
}

export default function MessageItem({
    content,
    fileUrl,
    isMine,
    status,
    createdAt,
}: MessageItemProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isColumn, setIsColumn] = useState(false);
    const screenWidth = useScreenWidth();

    const isMobileDevice = screenWidth! < 640;

    // Memoizing formatted time to prevent recalculations on every render
    const formattedTime = useMemo(() =>
        new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }).format(new Date(createdAt)),
        [createdAt]
    );

    const checkWidth = useCallback(() => {
        if (containerRef.current) {
            const result = isMobileDevice ?
                containerRef.current.offsetWidth > 256 :
                containerRef.current.offsetWidth > 384;

            setIsColumn(result);
        }
    }, []);

    useEffect(() => {
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, [checkWidth]);

    return (
        <div className={`${fileUrl ? "rounded-md" : "chat-bubble"} ${isMine ? "chat-bubble-primary text-white" : ""}`}>
            {fileUrl && (
                <div className="relative w-40 h-40">
                    <Image
                        src={fileUrl}
                        alt="Attachment"
                        fill
                        className="p-1 rounded-lg"
                        objectFit="cover"
                    />
                </div>
            )}
            {content && (
                <div
                    ref={containerRef}
                    className={`flex ${isColumn ? "flex-col" : "flex-row items-center"} gap-2`}
                >
                    <p className={`sm:max-w-96 max-w-64 text-sm sm:text-base break-words text-start ${fileUrl ? "p-2" : ""}`}>
                        {content}
                    </p>
                    <div className={`flex items-center gap-2 text-xs ${isColumn && `self-end`}`}>
                        <p className={`text-xs ${isMine ? `self-start` : `self-end`}`}>{formattedTime}</p>
                        {isMine && (
                            <>
                                {status === "PENDING" && <IoCheckmark size={18} />}
                                {status === "FAILED" && <CircleAlert className="text-red-500" size={18} />}
                                {status === "SENT" && <IoCheckmarkDone size={18} />}
                                {status === "SEEN" && <IoCheckmarkDone className="text-blue-600" size={18} />}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
