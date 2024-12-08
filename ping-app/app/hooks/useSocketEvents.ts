"use client";

import { useEffect, useCallback } from "react";
import { Socket } from "socket.io-client";
import { CallData } from "@/types/socket";
import { User } from "@prisma/client";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";

export const useSocketEvents = (
    socket: Socket | null,
    setIsConnected: (connected: boolean) => void,
    setOnlineUsers: (users: User[]) => void,
    setTypingUsers: (users: Record<string, boolean>) => void,
    setCurrentCall: (call: CallData | null) => void,
    setCalling: (data: string) => void,
    setIscallAccepted: (data: boolean) => void,
    setShowCallScreen: (data: boolean) => void
) => {
    const { toast } = useToast();
    const router = useRouter();

    // Modular event handlers
    const handleConnect = useCallback(() => setIsConnected(true), [setIsConnected]);
    const handleDisconnect = useCallback(() => setIsConnected(false), [setIsConnected]);

    const handleOnlineUsers = useCallback(
        (users: User[]) => setOnlineUsers(users),
        [setOnlineUsers]
    );

    const handleUserTyping = useCallback(
        ({ userId, chatId, isTyping }: { userId: string; chatId: string; isTyping: boolean }) => {
            // @ts-ignore
            setTypingUsers((prev) => ({
                ...prev,
                [`${userId}-${chatId}`]: isTyping,
            }));
        },
        [setTypingUsers]
    );

    const handleIncomingCall = useCallback(
        (data: CallData) => setCurrentCall(data),
        [setCurrentCall]
    );

    const handleCallAccepted = useCallback(
        (data: CallData) => {
            setCurrentCall({
                from: data.to,
                to: data.from,
                roomId: data.roomId,
                type: data.type,
            });
            setIscallAccepted(true);
            setShowCallScreen(true);
            setCalling("");
            router.push("/calls");
        },
        [setCurrentCall, setIscallAccepted, setShowCallScreen, setCalling, router]
    );

    const handleCallRejected = useCallback(() => {
        toast({
            title: "Call Rejected",
            description: "The user rejected your call",
            variant: "destructive",
        });
        setCurrentCall(null);
        setCalling("");
    }, [setCurrentCall, setCalling, toast]);

    const handleCallEnded = useCallback(() => {
        setShowCallScreen(false);
        toast({
            title: "Call Ended",
            description: "The call has ended",
        });
        setCurrentCall(null);
        setIscallAccepted(false);
    }, [setShowCallScreen, toast, setCurrentCall, setIscallAccepted]);

    const handleUserOffline = useCallback(() => {
        toast({
            title: "User Offline",
            description: "Cannot connect to the call",
            variant: "destructive",
        });
        setCurrentCall(null);
    }, [setCurrentCall, toast]);

    const handleCallCancelled = useCallback(() => {
        setCurrentCall(null);
    }, [setCurrentCall]);

    useEffect(() => {
        if (!socket) return;

        // Register socket events
        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("users:online", handleOnlineUsers);
        socket.on("user:typing", handleUserTyping);
        socket.on("call:incoming", handleIncomingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("call:rejected", handleCallRejected);
        socket.on("call:ended", handleCallEnded);
        socket.on("call:userOfline", handleUserOffline);
        socket.on("call:cancelled", handleCallCancelled);

        // Cleanup on unmount
        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("users:online", handleOnlineUsers);
            socket.off("user:typing", handleUserTyping);
            socket.off("call:incoming", handleIncomingCall);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("call:rejected", handleCallRejected);
            socket.off("call:ended", handleCallEnded);
            socket.off("call:userOfline", handleUserOffline);
            socket.off("call:cancelled", handleCallCancelled);
        };
    }, [
        socket,
        handleConnect,
        handleDisconnect,
        handleOnlineUsers,
        handleUserTyping,
        handleIncomingCall,
        handleCallAccepted,
        handleCallRejected,
        handleCallEnded,
        handleUserOffline,
        handleCallCancelled,
    ]);
};
