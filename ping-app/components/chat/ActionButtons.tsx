"use client";

import { Video, Phone, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import ActionTooltip from "@/components/action-tooltip";
import { useCallback } from "react";
import { useToast } from "@/app/hooks/use-toast";
import { useSocketContext } from "@/components/providers/socketProvider";
import { useRouter } from "next/navigation";

interface ActionButtonsProps {
    recipientId: string;
    currentUserId: string;
}

export function ActionButtons({ recipientId, currentUserId }: ActionButtonsProps) {

    const { socket,
        setCurrentCall,
        callState,
        setCallState,
        onlineUsers,
        getMediaStream
    } = useSocketContext();
    const { toast } = useToast();
    const router = useRouter();

    const initiateCall = useCallback(async (type: 'video' | 'voice') => {
        if (!socket) {
            toast({
                title: "Connection Error",
                description: "Unable to connect to call service",
                variant: "destructive",
            });
            return;
        }
        const stream = await getMediaStream(type);
        if (!stream) {
            console.error("No stream Available while initiating call");
            return;
        }

        setCurrentCall({
            from: currentUserId,
            to: recipientId,
            type,
        })
        setCallState("ringing")

        if (type === "video") router.push("/calls")

        socket.emit('call:initiate', {
            from: currentUserId,
            to: recipientId,
            type,
        });
    }, [
        socket,
        currentUserId,
        recipientId,
        toast,
        router,
        setCallState,
        setCurrentCall,
        getMediaStream
    ]);

    const disabled = callState === "ringing" || !onlineUsers.includes(recipientId)

    if (!recipientId) return null;

    return (
        <div className="flex items-center gap-2">
            <ActionTooltip label="Video Call">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-200 hover:text-white hover:bg-slate-700"
                    onClick={() => initiateCall('video')}
                    disabled={disabled}
                >
                    <Video className="w-5 h-5" />
                </Button>
            </ActionTooltip>
            <ActionTooltip label="Voice call">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-200 hover:text-white hover:bg-slate-700"
                    onClick={() => initiateCall('voice')}
                    disabled={disabled}
                >
                    <Phone className="w-5 h-5" />
                </Button>
            </ActionTooltip>
            <ActionTooltip label="More options">
                <Button
                    disabled
                    variant="ghost"
                    size="icon"
                    className="text-slate-200 hover:text-white hover:bg-slate-700">
                    <MoreVertical className="w-5 h-5" />
                </Button>
            </ActionTooltip>
        </div>
    );
}