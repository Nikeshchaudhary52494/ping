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
    } = useSocketContext();
    const { toast } = useToast();
    const router = useRouter();

    const initiateCall = useCallback((type: 'video' | 'voice') => {
        if (!socket) {
            toast({
                title: "Connection Error",
                description: "Unable to connect to call service",
                variant: "destructive",
            });
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
    }, [socket, currentUserId, recipientId, toast]);


    return (
        <div className="flex items-center gap-2">
            <ActionTooltip label="Video Call">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-200 hover:text-white hover:bg-slate-700"
                    onClick={() => initiateCall('video')}
                    disabled={callState === "ringing"}
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
                    disabled={callState === "ringing"}
                >
                    <Phone className="w-5 h-5" />
                </Button>
            </ActionTooltip>
            <ActionTooltip label="More options">
                <Button variant="ghost" size="icon" className="text-slate-200 hover:text-white hover:bg-slate-700">
                    <MoreVertical className="w-5 h-5" />
                </Button>
            </ActionTooltip>
        </div>
    );
}