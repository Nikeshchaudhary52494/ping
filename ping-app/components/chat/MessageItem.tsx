"use client";

import { messageStatus } from "@prisma/client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, EllipsisVertical, Reply, Trash2 } from "lucide-react";
import ActionTooltip from "@/components/action-tooltip";


import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import deleteMessage from "@/actions/chat/shared/deleteMessage";
import { toast } from "@/app/hooks/use-toast";
import { EditMessageDialog } from "./EditMessageDialog";

interface MessageItemProps {
    messageId: string;
    content: string;
    fileUrl?: string;
    isMine: boolean;
    createdAt: Date;
    status: messageStatus;
    isFirstMessage: boolean;
    isLastMessage: Boolean;
    isDeleted: boolean;
    isEdited: boolean;
    setReplying: (value: boolean) => void;
    SetReplyingMessage: (value: string) => void;
    receiverId?: string
}

export default function MessageItem({
    messageId,
    content,
    fileUrl,
    isMine,
    status,
    createdAt,
    isFirstMessage,
    isLastMessage,
    isDeleted,
    isEdited,
    setReplying,
    SetReplyingMessage,
    receiverId
}: MessageItemProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const [imageSize, setImageSize] = useState({ width: 100, height: 100 });
    const [isPopOpen, setPopOpen] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const canDeleteMessage = !isDeleted && isMine;

    const handleMessageDelete = async () => {
        await deleteMessage(messageId);
    }

    const handleCopyMessage = () => {
        navigator.clipboard.writeText(content);
        toast({ description: "Message copied!" });
    };

    const handleReplyMessage = () => {
        setReplying(true);
        SetReplyingMessage(content);
    }

    useEffect(() => {
        if (fileUrl) {
            const img = new window.Image();
            img.src = fileUrl;
            img.onload = () => {
                setImageSize({ width: img.width, height: img.height });
            };
        }
    }, [fileUrl]);


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
                    `${status == "FAILED" ? "bg-red-400" : "bg-primary text-primary-foreground"} rounded-r-[4px]
                     ${isFirstMessage && !fileUrl && "rounded-tr-[18px]"} 
                    ${isLastMessage && !fileUrl && "rounded-br-[18px]"}`
                    : `bg-secondary rounded-l-[4px] 
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
                            className={`flex flex-col relative w-full gap-2`}>
                            {isDeleted ?
                                <p className="text-sm italic"> this message is deleted</p> :
                                <p className={`sm:max-w-[50vw] max-w-[60vw] text-sm sm:text-base break-words text-start ${fileUrl ? "p-2" : ""} `}>
                                    {content}
                                </p>
                            }
                            {isEdited && !isDeleted && (
                                <p className={`text-xs italic text-end ${isMine ? "text-primary-foreground" : "text-xs italic text-primary"}`}>edited</p>
                            )}
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
                                        className="w-4 h-4 ml-auto transition cursor-pointer text-foreground/50 hover:text-foreground"
                                    />
                                </PopoverTrigger>
                                <PopoverContent className="w-44 rounded-[18px] p-1 gap-1 absolute flex flex-col -top-32 -left-48">
                                    <p className="p-1 px-4 text-sm">{formattedTime}</p>
                                    <Separator className="separator" />
                                    <Button onClick={handleCopyMessage} size="sm" variant="tab">
                                        <p>Copy</p>
                                        <Copy size={18} />
                                    </Button>

                                    <EditMessageDialog
                                        messageId={messageId}
                                        originalMessage={content}
                                        setOpenEditDialog={setOpenEditDialog}
                                        openEditDialog={openEditDialog}
                                        receiverId={receiverId}
                                    />

                                    <Separator className="separator" />
                                    <Button onClick={handleMessageDelete} size="sm" className="flex justify-between w-full font-semibold bg-transparent hover:bg-secondary text-red-500 rounded-[16px]">
                                        <p>Delete</p>
                                        <Trash2 size={18} />
                                    </Button>

                                </PopoverContent>
                            </Popover>
                        </ActionTooltip>

                        <ActionTooltip label="reply">
                            <Reply
                                onClick={handleReplyMessage}
                                className="w-4 h-4 ml-auto transition cursor-pointer text-foreground/50 hover:text-foreground"
                            />
                        </ActionTooltip>

                        {/* reaction button will be added */}

                    </div>
                </div>
            )}
        </div>
    );
}
