"use client"

import { Message } from '@prisma/client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MessageContextType {
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    addMessage: (newMessage: Message) => void;
    updateMessage: (tempId: string, newMessage: Message) => void;
    updateMessageStatus: (tempId: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    const addMessage = (newMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const updateMessage = (tempId: string, newMessage: Message) => {
        setMessages((prevMessages) =>
            prevMessages.map((msg) => (msg.id === tempId ? newMessage : msg))
        );
    };

    const updateMessageStatus = (tempId: string) => {
        setMessages((prevMessages: Message[]) =>
            prevMessages.map((msg: Message) =>
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
