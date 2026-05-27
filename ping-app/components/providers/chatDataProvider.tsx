"use client";

import { PrivateChat, UserGroups } from '@/types/prisma';
import React, { createContext, useState, ReactNode, useContext, useMemo } from 'react';

interface dataContextProps {
    privateChats: PrivateChat[];
    groupList: UserGroups[];
    addPrivateChat: (chat: PrivateChat) => void;
    addGroup: (group: UserGroups) => void;
    setPrivateChats: (friendList: PrivateChat[]) => void;
    setGroupList: (groupList: UserGroups[]) => void;
    updateChatLastMessage: (chatId: string, message: any) => void;
}

const ChatDataContext = createContext<dataContextProps | undefined>(undefined);

export const ChatDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [privateChats, setPrivateChats] = useState<PrivateChat[]>([]);
    const [groupList, setGroupList] = useState<UserGroups[]>([]);

    const chatIdSet = useMemo(() => new Set(privateChats.map((chat) => chat.id)), [privateChats]);
    const groupIdSet = useMemo(() => new Set(groupList.map((group) => group.chat.id)), [groupList]);

    const addPrivateChat = (chat: PrivateChat) => {
        if (!chatIdSet.has(chat.id)) {
            setPrivateChats((prevChats) => [...prevChats, chat]);
            chatIdSet.add(chat.id);
        }
    };

    const addGroup = (group: UserGroups) => {
        if (!groupIdSet.has(group.chat.id)) {
            setGroupList((prevGroups) => [...prevGroups, group]);
            groupIdSet.add(group.chat.id);
        }
    };

    const updateChatLastMessage = (chatId: string, message: any) => {
        setPrivateChats(prev => prev.map(chat => {
            if (chat.id === chatId) {
                return { ...chat, messages: [message] };
            }
            return chat;
        }));
        setGroupList(prev => prev.map(group => {
            if (group.chat.id === chatId) {
                return { ...group, chat: { ...group.chat, messages: [message] } };
            }
            return group;
        }));
    };

    return (
        <ChatDataContext.Provider value={{ privateChats, groupList, addPrivateChat, addGroup, setPrivateChats, setGroupList, updateChatLastMessage }}>
            {children}
        </ChatDataContext.Provider>
    );
};

export const useChatData = (): dataContextProps => {
    const context = useContext(ChatDataContext);
    if (!context) {
        throw new Error('useChatData must be used within a ChatDataProvider');
    }
    return context;
};