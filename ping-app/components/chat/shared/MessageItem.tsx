"use client";

import { messageStatus } from "@prisma/client";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { IoCheckmarkDone, IoCheckmark } from "react-icons/io5";
import { CircleAlert, Copy, Delete, Edit, EllipsisVertical, Forward, Reply, Smile, Trash, Trash2 } from "lucide-react";
import useScreenWidth from "@/app/hooks/useScreenWidth";
import ActionTooltip from "@/components/action-tooltip";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { actionButtons } from "@/lib/tabLinks";

interface MessageItemProps {
    content: string;
    fileUrl?: string;
    isMine: boolean;
    createdAt: Date;
    status: messageStatus;
    isFirstMessage: boolean;
    isLastMessage: Boolean;
    isDeleted: boolean;
    isEdited: boolean;
}

export default function MessageItem({
    content,
    fileUrl,
    isMine,
    status,
    createdAt,
    isFirstMessage,
    isLastMessage,
    isDeleted,
    isEdited,
}: MessageItemProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const screenWidth = useScreenWidth();

    const [imageSize, setImageSize] = useState({ width: 100, height: 100 });
    const [isPopOpen, setPopOpen] = useState(false);

    const canDeleteMessage = !isDeleted && isMine;
    const canEditMessage = !isDeleted && isMine && !fileUrl;

    useEffect(() => {
        if (fileUrl) {
            const img = new window.Image();
            img.src = fileUrl;
            img.onload = () => {
                setImageSize({ width: img.width, height: img.height });
            };
        }
    }, [fileUrl]);

    const isMobileDevice = screenWidth! < 640;

    // Memoizing formatted time to prevent recalculations on every render
    const formattedTime = useMemo(
        () =>
            new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            }).format(new Date(createdAt)),
        [createdAt]
    );

    return (
        <div className={`relative flex w-full items-center gap-6 group ${isMine && `flex-row-reverse`}`}>
            <div className={`
                ${fileUrl ? "rounded-md" : "rounded-[18px] px-[12px] py-[7px] "} 
                ${isMine ?
                    `bg-[#3797F0] rounded-r-[4px]
                     ${isFirstMessage && !fileUrl && "rounded-tr-[18px]"} 
                    ${isLastMessage && !fileUrl && "rounded-br-[18px]"}`
                    : `bg-[#262626] rounded-l-[4px] 
                    ${isFirstMessage && !fileUrl && "rounded-tl-[18px]"}
                    ${isLastMessage && !fileUrl && "rounded-bl-[18px]"}
                `}`} >
                {fileUrl && (
                    <div className="relative md:max-w-64 max-w-40">
                        <Image
                            src={fileUrl}
                            alt="Attachment"
                            width={imageSize.width}
                            height={imageSize.height}
                            className="p-1 rounded-lg"
                            objectFit="cover"
                        />
                    </div>
                )}
                {
                    content && (
                        <div
                            ref={containerRef}
                            className={`flex relative w-full gap-2`}>
                            <p className={`sm:max-w-96 max-w-64 tsxt-sm sm:text-base break-words text-start ${fileUrl ? "p-2" : ""} `}>
                                {content}
                            </p>
                        </div>
                    )
                }
            </div >
            {canDeleteMessage && (
                <div className="relative">
                    <div className={`gap-2 flex ${!isPopOpen && `hidden group-hover:flex`}`}>
                        <ActionTooltip label="more">
                            <Popover open={isPopOpen} onOpenChange={setPopOpen}>
                                <PopoverTrigger asChild>
                                    <EllipsisVertical
                                        onClick={() => setPopOpen((prev) => !prev)}
                                        className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                                    />
                                </PopoverTrigger>
                                <PopoverContent className="w-44 rounded-[18px] p-1 absolute gap-1 flex flex-col bg-[#262626] -top-60 border-zinc-700 -left-44">
                                    <p className="p-1 px-4 text-sm">{formattedTime}</p>
                                    <Separator className="separator" />

                                    {actionButtons.map(({ label, Icon }) => (
                                        <Button key={label} size="sm" variant="tab">
                                            <p>{label}</p>
                                            <Icon size={18} />
                                        </Button>
                                    ))}

                                    <Separator className="separator" />

                                    <Button size="sm" className="flex justify-between w-full font-semibold bg-transparent hover:bg-zinc-700 text-red-500 rounded-[16px]">
                                        <p>Delete</p>
                                        <Trash2 size={18} />
                                    </Button>
                                </PopoverContent>
                            </Popover>
                        </ActionTooltip>

                        <ActionTooltip label="reply">
                            <Reply
                                onClick={() => { }}
                                className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                            />
                        </ActionTooltip>

                        <ActionTooltip label="smile">
                            <Smile
                                onClick={() => { }}
                                className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                            />
                        </ActionTooltip>
                    </div>
                </div>
            )}
        </div>
    );
}

