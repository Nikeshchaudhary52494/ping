'use client';

import { Image as ImageIcon, SendHorizonal, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useRef, useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { toast } from '@/app/hooks/use-toast';
import { useUploadThing } from '@/lib/uploadthing';
import { useMessage } from '@/components/providers/messageProvider';
import axiosInstance from '@/lib/axiosConfig';
import Image from 'next/image';
import getUserPublicKey from '@/actions/user/getUserPublicKey';
import { DecryptedMessages } from '@/types/prisma';
import { decryptGroupKey, encryptGroupMessage, encryptPrivateMessage } from '@/lib/crypto';

interface MessageInputProps {
    senderId: string;
    receiverId?: string;
    setToBottom: (set: boolean) => void;
    isGroup?: boolean;
    encryptedGroupKey?: string;
    nonce?: string;
    ownerId?: string;
    receiversId?: {
        id: string;
    }[];
}

export default function MessageInput({
    senderId,
    receiverId,
    setToBottom,
    receiversId,
    encryptedGroupKey,
    isGroup = false,
    nonce,
    ownerId,
}: MessageInputProps) {

    const { addMessage, updateMessage, updateMessageStatus } = useMessage();
    const params = useParams();
    const { startUpload } = useUploadThing("messageFile");

    const chatId = params?.privateChatId || params?.groupChatId as string;

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [content, setContent] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [senderPrivateKey, setSenderPrivateKey] = useState("");
    const [receiverPublicKey, setReceiverPublicKey] = useState("");

    useEffect(() => {
        async function loadKeys() {
            const storedPrivateKey = localStorage.getItem("pingPrivateKey");

            if (storedPrivateKey) {
                setSenderPrivateKey(storedPrivateKey);
            } else {
                console.error("No encryption keys found! Ensure they are set during onboarding.");
            }
            if (receiverId) {
                const receiverPublicKey = await getUserPublicKey(receiverId);
                setReceiverPublicKey(receiverPublicKey!);

            }
        }

        loadKeys();
    }, [receiverId, senderId]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFiles(Array.from(e.target.files!));

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!content?.trim() && files.length === 0) {
            toast({ description: 'Message or image must not be empty.' });
            return;
        }

        if (!receiverPublicKey && !isGroup) {
            console.error("reciver Public key not available");
            return;
        }
        let encrypted;
        if (isGroup) {

            const currentUserPrivateKey = localStorage.getItem('pingPrivateKey');
            const groupOwnerPublicKey = await getUserPublicKey(ownerId!);
            console.log(encryptedGroupKey);
            const groupKey = await decryptGroupKey(encryptedGroupKey!, nonce!, currentUserPrivateKey!, groupOwnerPublicKey!);
            console.log("groupkey", groupKey)
            encrypted = await encryptGroupMessage(content, groupKey);
        } else {
            encrypted = await encryptPrivateMessage(content, receiverPublicKey, senderPrivateKey);
        }

        let fileUrl = null;
        if (files.length > 0) {
            try {
                const imgRes = await startUpload(files);
                if (imgRes && imgRes.length > 0) {
                    fileUrl = imgRes[0].url;
                }
            } catch (error) {
                console.error('Failed to upload file:', error);
                toast({ description: 'Failed to upload the file. Please try again.' });
                return;
            }
        }

        const tempMessage: DecryptedMessages = {
            id: `temp-${Date.now()}`, // Temporary ID
            content,
            fileUrl,
            senderId,
            chatId: chatId.toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
            isEdited: false,
            isForwarded: false,
            status: 'PENDING'
        };

        addMessage(tempMessage);
        setToBottom(true);

        try {
            setContent('');
            setFiles([]);
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

            const res = await axiosInstance.post(`/api/message/send/${chatId}`, {
                encryptedContent: encrypted.encryptedMessage,
                nonce: encrypted.nonce,
                senderId,
                receiverId,
                fileUrl,
            });
            // Replace the temporary message with the actual one from the server
            updateMessage(tempMessage.id, { ...res.data, content });
            console.log("response data", res.data);
        } catch (error) {
            console.error('Failed to send message:', error);
            toast({ description: 'Failed to send message. Please try again later.', variant: "destructive" });
            updateMessageStatus(tempMessage.id);

        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <>
            {imagePreview && (
                <div className="flex items-center gap-2 mb-3">
                    <div className="relative ">
                        <div className='relative w-20 h-20 overflow-hidden border rounded-lg border-secondary-foreground/20'>
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                fill
                                className="object-cover "
                            />
                        </div>
                        <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 p-1 rounded-full hover:bg-red-500 bg-red-400 flex items-center justify-center"
                            type="button"
                        >
                            <X size={10} />
                        </button>
                    </div>
                </div>
            )}
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className="flex p-2 items-center border rounded-full border-primary/50"
                onClick={() => setIsFocused(true)}
            >
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                />
                <button
                    type="button"
                    className={`flex items-center justify-center p-2 rounded-full text-primary-foreground bg-primary ${imagePreview && "text-emerald-500"}`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <ImageIcon size={20} />
                </button>
                <input
                    type="text"
                    ref={inputRef}
                    value={content!}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-2 bg-transparent outline-none placeholder:text-sm"
                    onFocus={() => setIsFocused(true)}
                />
                <button
                    type="submit"
                    disabled={!fileInputRef.current?.value && !content}
                    className="flex items-center disabled:hidden text-slate-400 hover:bg-primary/40 hover:text-primary-foreground justify-center p-2 rounded-full"
                >
                    <SendHorizonal size={20} />
                </button>
            </form>
        </>
    );
};