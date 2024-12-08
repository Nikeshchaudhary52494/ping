"use client";

import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from './userProvider';
import { SocketContextType, CallData } from '@/types/socket';
import { useSocketEvents } from '@/app/hooks/useSocketEvents';
import { User } from '@prisma/client';

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    onlineUsers: [],
    typingUsers: {},
    currentCall: null,
    calling: "",
    setCalling: () => { },
    setCurrentCall: () => { },
    setIsCallAccepted: () => { },
    isCallAccepted: false,
    showCallScreen: false,
    setShowCallScreen: () => { }
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
    const [currentCall, setCurrentCall] = useState<CallData | null>(null);
    const [isCallAccepted, setIsCallAccepted] = useState(false);
    const [showCallScreen, setShowCallScreen] = useState(false);
    const [calling, setCalling] = useState("");

    const { user } = useUser();

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
        setCalling,
        setIsCallAccepted,
        setShowCallScreen
    );

    const value = {
        socket,
        isConnected,
        onlineUsers,
        typingUsers,
        currentCall,
        setCurrentCall,
        calling,
        setCalling,
        isCallAccepted,
        setIsCallAccepted,
        showCallScreen,
        setShowCallScreen,
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