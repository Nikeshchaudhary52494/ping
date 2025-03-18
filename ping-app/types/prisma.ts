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
        nonce: string;
        encryptedContent: string | null;
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
            nonce: string;
            encryptedContent: string | null;
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
    ownerId: string;
    encryptedKey: string;
    nonce:string;
    members: {
        id: string;
    }[];
}

export interface LastMessage {
    createdAt: Date;
    nonce: string;
    encryptedContent: string | null;
    isDeleted: boolean;
    fileUrl: string | null;
    updatedAt: Date;
}

export interface DecryptedMessages {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    senderId: string;
    content: string | null;
    fileUrl: string | null;
    isDeleted: boolean;
    isEdited: boolean;
    isForwarded: boolean;
    status: messageStatus;
    chatId: string;
}