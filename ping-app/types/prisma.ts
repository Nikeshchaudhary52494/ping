import { ChatType, messageStatus, User } from "@prisma/client";

export interface PrivateChat {
    id: string;
    type: ChatType;
    members: {
        id: string;
        displayName: string;
        imageUrl: string | null;
        settings: {
            showProfileImage: boolean;
            hideProfile: boolean;
            hideOnlineStatus: boolean;
        } | null;
    }[];
    messages: {
        status: messageStatus;
        fileUrl: string | null;
        senderId: string
        encryptedContent: string | null;
        nonce: string | null;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
    }[];
}

export interface UserTab {
    id: string;
    displayName: string;
    username: string | null;
    imageUrl: string | null;
}

export interface MyUser extends User {
    settings: {
        showProfileImage: boolean;
        restrictMessagesFromUnknown: boolean;
        hideProfile: boolean;
        hideOnlineStatus: boolean;
    } | null;
}

export interface GroupSearchData {
    chatId: string;
    name: string;
    imageUrl: string | null;
}

export interface UserGroups {
    id: string;
    name: string;
    chat: {
        id: string;
        messages: {
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
    imageUrl: string | null;
    id: string;
    about: string | null;
    chatId: string;
    members: {
        imageUrl: string | null;
        id: string;
        username: string | null;
        displayName: string;
    }[];
}

export interface LastMessage {
    nonce?: string | null;
    senderId?: string
    encryptedContent: string | null;
    isDeleted: boolean;
    fileUrl: string | null;
    updatedAt: Date;
    createdAt: Date;
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