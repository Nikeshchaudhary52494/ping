"use client"

import { DecryptedMessages } from '@/types/prisma';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MessageContextType {
    messages: DecryptedMessages[];
    setMessages: (messages: DecryptedMessages[]) => void;
    addMessage: (newMessage: DecryptedMessages) => void;
    updateMessage: (tempId: string, newMessage: DecryptedMessages) => void;
    updateMessageStatus: (tempId: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<DecryptedMessages[]>([]);

    const addMessage = (newMessage: DecryptedMessages) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const updateMessage = (tempId: string, newMessage: DecryptedMessages) => {
        setMessages((prevMessages) =>
            prevMessages.map((msg) => (msg.id === tempId ? newMessage : msg))
        );
    };

    const updateMessageStatus = (tempId: string) => {
        setMessages((prevMessages: DecryptedMessages[]) =>
            prevMessages.map((msg: DecryptedMessages) =>
                msg.id === tempId ? { ...msg, status: "FAILED" } : msg
            )
        );
    };

    return (
        <MessageContext.Provider value={{ messages, setMessages, addMessage, updateMessage, updateMessageStatus }}>
            {children}
        </MessageContext.Provider>
    );
};

export const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
};
