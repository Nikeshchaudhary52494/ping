"use client";

import { User } from '@prisma/client';
import { Socket } from 'socket.io-client';

export interface CallData {
    from: string;
    to: string;
    type: 'video' | 'voice';
    roomId?: string;
}

export type CallState =
    | 'idle'
    | 'incoming'
    | 'ringing'
    | 'accepted'
    | 'ended'
    | 'rejected'

export interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    onlineUsers: string[];
    typingUsers: Record<string, boolean>;
    currentCall: CallData | null;

    setCurrentCall: (currentCall: CallData | null) => void;
    callState: CallState,
    setCallState: (state: CallState) => void

    localStreamRef: React.MutableRefObject<MediaStream | null>
    remoteStream: MediaStream | null,
    setRemoteStream: (stream: MediaStream | null) => void,
    peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>
}