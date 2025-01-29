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
    onlineUsers: User[];
    typingUsers: Record<string, boolean>;
    currentCall: CallData | null;
    // calling: string,
    // isCallAccepted: boolean
    // showCallScreen: boolean,

    setCurrentCall: (currentCall: CallData | null) => void;
    // setCalling: (data: string) => void,
    // setIsCallAccepted: (data: boolean) => void,
    // setShowCallScreen: (data: boolean) => void,
    callState: CallState,
    setCallState: (state: CallState) => void
    // localStream: MediaStream | null,
    // setLocalStream: (stream: MediaStream | null) => void,
    localStreamRef: React.MutableRefObject<MediaStream | null>
    remoteStream: MediaStream | null,
    setRemoteStream: (stream: MediaStream | null) => void,
    peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>
}