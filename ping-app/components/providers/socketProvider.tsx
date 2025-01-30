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
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteStreamRef = useRef<MediaStream | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    const { user } = useUser();

    const getMediaStream = useCallback(async (faceMode?: string) => {
        if (localStreamRef.current) {
            return localStreamRef.current
        }

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === "videoinput");
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    facingMode: videoDevices.length > 0 ? faceMode : undefined
                }
            })
            localStreamRef.current = stream;
            return stream;
        } catch (error) {
            console.error("failed to get stream", error)
            return null;
        }
    }, [localStreamRef])

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
        localStreamRef,
        remoteStreamRef,
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
        localStreamRef,
        remoteStreamRef,
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