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