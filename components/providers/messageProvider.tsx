"use client"

import { Message } from '@prisma/client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MessageContextType {
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    addMessage: (newMessage: Message) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    const addMessage = (newMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    return (
        <MessageContext.Provider value={{ messages, setMessages, addMessage }}>
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
