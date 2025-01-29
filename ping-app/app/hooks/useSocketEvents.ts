"use client";

import { useEffect, useCallback, MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import { CallData, CallState } from "@/types/socket";
import { User } from "@prisma/client";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";
import { handleAnswer, handleCandidate, handleOffer } from "@/lib/webrtc";

export const useSocketEvents = (
    socket: Socket | null,
    setIsConnected: (connected: boolean) => void,
    setOnlineUsers: (usersId: string[]) => void,
    setTypingUsers: (users: Record<string, boolean>) => void,
    setCurrentCall: (call: CallData | null) => void,
    setCallState: (state: CallState) => void,
    localStreamRef: MutableRefObject<MediaStream | null>,
    peerConnectionRef: MutableRefObject<RTCPeerConnection | null>,
    setRemoteStream: (stream: MediaStream) => void
) => {
    const { toast } = useToast();
    const router = useRouter();

    const handleConnect = useCallback(() => setIsConnected(true), [setIsConnected]);
    const handleDisconnect = useCallback(() => setIsConnected(false), [setIsConnected]);

    const handleOnlineUsers = useCallback(
        (usersId: string[]) => setOnlineUsers(usersId),
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
        (data: CallData) => {
            setCurrentCall(data);
            setCallState("incoming")
        },
        [setCallState, setCurrentCall]
    );

    const handleCallAccepted = useCallback((data: CallData) => {
        setCurrentCall(data);
        setCallState("accepted");
        router.push("/calls");
    },
        [setCallState, router, setCurrentCall]
    );

    const handleCallRejected = useCallback(() => {
        toast({
            title: "Call Rejected",
            description: "The user rejected your call",
            variant: "destructive",
        });
        setCallState("rejected");
        setCurrentCall(null);
    }, [setCurrentCall, toast, setCallState]);

    const handleCallEnded = useCallback(() => {
        setCallState("ended");
        toast({
            title: "Call Ended",
            description: "The call has ended",
        });
        setCurrentCall(null);
        // setIscallAccepted(false);
    }, [toast, setCurrentCall, setCallState]);

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

    const onOffer = (data: { sdp: RTCSessionDescriptionInit, from: string }) => {
        handleOffer({ data, pc: peerConnectionRef, socket, localStream: localStreamRef, setRemoteStream });
    };

    const onAnswer = (data: { sdp: RTCSessionDescriptionInit }) => {
        handleAnswer({ data, pc: peerConnectionRef as MutableRefObject<RTCPeerConnection>, setRemoteStream });
    };

    const onCandidate = (data: { candidate: RTCIceCandidateInit }) => {
        handleCandidate({ data, pc: peerConnectionRef as MutableRefObject<RTCPeerConnection> });
    };

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
        socket.on("webrtc:offer", onOffer);
        socket.on("webrtc:answer", onAnswer);
        socket.on("webrtc:candidate", onCandidate);

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
            socket.off("webrtc:offer", onOffer);
            socket.off("webrtc:answer", onAnswer);
            socket.off("webrtc:candidate", onCandidate);
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
