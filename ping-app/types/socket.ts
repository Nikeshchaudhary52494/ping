"use client";

import { User } from '@prisma/client';
import { Socket } from 'socket.io-client';

export interface CallData {
    from: string;
    to: string;
    type: 'video' | 'voice';
    roomId?: string;
}

export interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    onlineUsers: User[];
    typingUsers: Record<string, boolean>;
    currentCall: CallData | null;
    calling: string,
    isCallAccepted: boolean
    showCallScreen: boolean,

    setCurrentCall: (currentCall: CallData | null) => void;
    setCalling: (data: string) => void,
    setIsCallAccepted: (data: boolean) => void,
    setShowCallScreen: (data: boolean) => void,
}