import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { PrivateChat, UserGroups } from '@/types/prisma';

export interface MessageDB {
    id: string;
    content: string | null;
    nonce: string | null;
    fileUrl: string | null;
    isDeleted: boolean;
    isEdited: boolean;
    isForwarded: boolean;
    status: string;
    senderId: string;
    chatId: string;
    createdAt: Date;
    sender?: {
        id: string;
        displayName: string;
        imageUrl: string | null;
        username: string | null;
    };
}

interface PingDB extends DBSchema {
    messages: {
        key: string;
        value: MessageDB;
        indexes: { 'by-chatId': string };
    };
    privateChats: {
        key: string;
        value: PrivateChat;
    };
    groupChats: {
        key: string;
        value: UserGroups;
    };
}

const DB_NAME = 'pingDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<PingDB>> | null = null;

export const getDB = () => {
    if (typeof window === 'undefined') return null;

    if (!dbPromise) {
        dbPromise = openDB<PingDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('messages')) {
                    const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
                    messageStore.createIndex('by-chatId', 'chatId');
                }
                if (!db.objectStoreNames.contains('privateChats')) {
                    db.createObjectStore('privateChats', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('groupChats')) {
                    db.createObjectStore('groupChats', { keyPath: 'chat.id' });
                }
            },
        });
    }
    return dbPromise;
};

export const idbMessages = {
    async getByChatId(chatId: string): Promise<MessageDB[]> {
        const db = await getDB();
        if (!db) return [];
        const messages = await db.getAllFromIndex('messages', 'by-chatId', chatId);
        return messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    },
    async put(message: MessageDB) {
        const db = await getDB();
        if (!db) return;
        await db.put('messages', message);
    },
    async putBulk(messages: MessageDB[]) {
        const db = await getDB();
        if (!db) return;
        const tx = db.transaction('messages', 'readwrite');
        for (const msg of messages) {
            tx.store.put(msg);
        }
        await tx.done;
    },
    async delete(id: string) {
        const db = await getDB();
        if (!db) return;
        await db.delete('messages', id);
    },
    async update(id: string, partial: Partial<MessageDB>) {
        const db = await getDB();
        if (!db) return;
        const msg = await db.get('messages', id);
        if (msg) {
            await db.put('messages', { ...msg, ...partial });
        }
    }
};

export const idbChats = {
    async getPrivateChats(): Promise<PrivateChat[]> {
        const db = await getDB();
        if (!db) return [];
        return db.getAll('privateChats');
    },
    async putPrivateChats(chats: PrivateChat[]) {
        const db = await getDB();
        if (!db) return;
        const tx = db.transaction('privateChats', 'readwrite');
        await tx.store.clear();
        for (const chat of chats) {
            tx.store.put(chat);
        }
        await tx.done;
    },
    async getGroupChats(): Promise<UserGroups[]> {
        const db = await getDB();
        if (!db) return [];
        return db.getAll('groupChats');
    },
    async putGroupChats(groups: UserGroups[]) {
        const db = await getDB();
        if (!db) return;
        const tx = db.transaction('groupChats', 'readwrite');
        await tx.store.clear();
        for (const group of groups) {
            tx.store.put(group);
        }
        await tx.done;
    }
};

export const clearPingDB = async () => {
    const db = await getDB();
    if (!db) return;
    await db.clear('messages');
    await db.clear('privateChats');
    await db.clear('groupChats');
};
