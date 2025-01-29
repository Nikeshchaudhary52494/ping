"use client";

import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from './userProvider';
import { SocketContextType, CallData, CallState } from '@/types/socket';
import { useSocketEvents } from '@/app/hooks/useSocketEvents';
import { User } from '@prisma/client';

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
    const [currentCall, setCurrentCall] = useState<CallData | null>(null);
    const [callState, setCallState] = useState<CallState>("idle");
    const localStreamRef = useRef<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    const { user } = useUser();

    console.log({ peerConnectionRef, user: user?.displayName });

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
        peerConnectionRef,
        setRemoteStream
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
        remoteStream,
        setRemoteStream,
        peerConnectionRef
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