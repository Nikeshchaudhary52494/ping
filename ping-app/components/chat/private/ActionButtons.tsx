"use client";

import { Video, Phone, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import ActionTooltip from "@/components/action-tooltip";
import { useCallback } from "react";
import { useToast } from "@/app/hooks/use-toast";
import { useSocketContext } from "@/components/providers/socketProvider";

interface ActionButtonsProps {
    recipientId: string;
    currentUserId: string;
}

export function ActionButtons({ recipientId, currentUserId }: ActionButtonsProps) {
    const { socket, setCalling, calling, currentCall } = useSocketContext();
    const { toast } = useToast();

    const initiateCall = useCallback((type: 'video' | 'voice') => {
        if (!socket) {
            toast({
                title: "Connection Error",
                description: "Unable to connect to call service",
                variant: "destructive",
            });
            return;
        }

        socket.emit('call:initiate', {
            from: currentUserId,
            to: recipientId,
            type,
        });
        setCalling(recipientId);
    }, [socket, currentUserId, recipientId, toast, setCalling]);

    const isOnCall = (calling || currentCall) ? true : false;

    return (
        <div className="flex items-center gap-2">
            <ActionTooltip label="Video Call">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-200 hover:text-white hover:bg-slate-700"
                    onClick={() => initiateCall('video')}
                    disabled={isOnCall}
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
                    disabled={isOnCall}
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