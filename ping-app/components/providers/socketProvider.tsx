"use client";

import {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from './userProvider';
import { SocketContextType, CallData, CallState } from '@/types/socket';
import { useSocketEvents } from '@/app/hooks/useSocketEvents';

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
    const [currentCall, setCurrentCall] = useState<CallData | null>(null);
    const [callState, setCallState] = useState<CallState>("idle");
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    const { user } = useUser();

    const getMediaStream = useCallback(async (calltype: "voice" | "video") => {
        if (localStream) {
            return localStream
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: calltype == "video"
            })
            setLocalStream(stream);
            return stream;
        } catch (error) {
            console.error("failed to get stream", error)
            return null;
        }
    }, [localStream])

    useEffect(() => {
        if (user) {
            const socketInstance = io(
                process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000',
                {
                    path: "/socket.io",
                    query: {
                        userId: user.id,
                    },
                    transports: ['websocket'],
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                }
            );

            setSocket(socketInstance);

            return () => {
                socketInstance.disconnect();
                setSocket(null);
            };
        }
    }, [user]);

    useSocketEvents(
        socket,
        setIsConnected,
        setOnlineUsers,
        setTypingUsers,
        setCurrentCall,
        setCallState,
        localStream,
        setLocalStream,
        remoteStream,
        setRemoteStream,
        peerConnectionRef,
    );

    const value = {
        socket,
        isConnected,
        onlineUsers,
        typingUsers,
        currentCall,
        setCurrentCall,
        callState,
        setCallState,
        localStream,
        remoteStream,
        setRemoteStream,
        setLocalStream,
        peerConnectionRef,
        getMediaStream,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocketContext must be used within a SocketProvider');
    }
    return context;
};