"use client";

import { useSocketContext } from '@/components/providers/socketProvider';
// import { useSocketContext } from '@/components/providers/socketProvider';
import { useCallback } from 'react';

export const useChat = (chatId: string) => {
    const { socket } = useSocketContext();

    const sendMessage = useCallback((content: string) => {
        if (socket) {
            socket.emit('message:send', { chatId, content });
        }
    }, [socket, chatId]);

    const setTyping = useCallback((isTyping: boolean) => {
        if (socket) {
            socket.emit('user:typing', { chatId, isTyping });
        }
    }, [socket, chatId]);

    return {
        sendMessage,
        setTyping,
    };
};