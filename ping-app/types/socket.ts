"use client";

import { CallType } from '@prisma/client';
import { Socket } from 'socket.io-client';

export interface CallData {
    from: string;
    to: string;
    type: CallType;
    roomId?: string;
}

export type CallState =
    | 'idle'
    | 'incoming'
    | 'ringing'
    | 'accepted'
    | 'ended'
    | 'rejected'
    | 'dropped'

export interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    onlineUsers: string[];
    typingUsers: Record<string, boolean>;
    currentCall: CallData | null;

    setCurrentCall: (currentCall: CallData | null) => void;
    callState: CallState,
    setCallState: (state: CallState) => void

    localStream: MediaStream | null
    remoteStream: MediaStream | null
    setRemoteStream: (stream: MediaStream | null) => void
    setLocalStream: (stream: MediaStream | null) => void
    peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>
    getMediaStream: (calltype: CallType) => Promise<MediaStream | null>
}