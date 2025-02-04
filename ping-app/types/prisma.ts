import { ChatType, messageStatus } from "@prisma/client";

export interface PrivateChat {
    id: string;
    type: ChatType;
    members: {
        id: string;
        displayName: string;
        imageUrl: string | null;
    }[];
    messages: {
        createdAt: Date;
        updatedAt: Date;
        content: string | null;
        fileUrl: string | null;
        isDeleted: boolean;
        status: messageStatus;
    }[];
}

export interface UserTab {
    id: string;
    displayName: string;
    username: string | null;
    imageUrl: string | null;
}

export interface GroupSearchData {
    id: string;
    name: string;
    imageUrl: string | null;
}

export interface UserGroups {
    id: string;
    name: string;
    chat: {
        id: string;
        messages: {
            content: string | null;
            createdAt: Date;
            updatedAt: Date;
            fileUrl: string | null;
            isDeleted: boolean;
        }[];
    };
    imageUrl: string | null;
}

export interface GroupChatData {
    name: string;
    chatId: string;
    imageUrl: string | null;
    members: {
        id: string;
    }[];
}

export interface LastMessage {
    createdAt: Date;
    content: string | null;
    isDeleted: boolean;
    fileUrl: string | null;
    updatedAt: Date;
}