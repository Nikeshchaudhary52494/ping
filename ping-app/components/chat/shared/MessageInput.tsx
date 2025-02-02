'use client';

import { Image as ImageIcon, SendHorizonal, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useRef, useState, ChangeEvent, FormEvent } from 'react';
import { toast } from '@/app/hooks/use-toast';
import { useUploadThing } from '@/lib/uploadthing';
import { useMessage } from '@/components/providers/messageProvider';
import axiosInstance from '@/lib/axiosConfig';
import Image from 'next/image';
import { Message } from '@prisma/client';

interface MessageInputProps {
    senderId: string;
    receiverId?: string;
    setToBottom: (set: boolean) => void;
}

export default function MessageInput({
    senderId,
    receiverId,
    setToBottom
}: MessageInputProps) {

    const { addMessage, updateMessage, updateMessageStatus } = useMessage();
    const params = useParams();
    const chatId = params?.privateChatId || params?.groupChatId as string;

    const [content, setContent] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { startUpload } = useUploadThing("messageFile");

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

        const tempMessage: Message = {
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
                content,
                senderId,
                receiverId,
                fileUrl,
            });
            // Replace the temporary message with the actual one from the server
            updateMessage(tempMessage.id, res.data);
        } catch (error) {
            console.error('Failed to send message:', error);
            toast({ description: 'Failed to send message. Please try again later.' });
            updateMessageStatus(tempMessage.id);

        }
    };


    return (
        <>
            {imagePreview && (
                <div className="flex items-center gap-2 mb-3">
                    <div className="relative">
                        <Image
                            src={imagePreview}
                            alt="Preview"
                            className="object-cover w-20 h-20 border rounded-lg border-zinc-700"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-400 flex items-center justify-center"
                            type="button"
                        >
                            <X size={10} />
                        </button>
                    </div>
                </div>
            )}
            <form
                onSubmit={onSubmit}
                className="flex bg-[#0D0D0E] p-2 items-center border rounded-full border-l-[1px] border-slate-200 border-opacity-10"
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
                    className={`flex items-center justify-center p-2 rounded-full bg-slate-700/20 ${imagePreview ? 'text-emerald-500' : 'text-zinc-400'}`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <ImageIcon size={20} />
                </button>
                <input
                    type="text"
                    value={content!}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-2 bg-transparent outline-none placeholder:text-state-400 placeholder:text-sm"
                />
                <button
                    type="submit"
                    className="flex items-center text-slate-400 hover:bg-[#1E1F22] justify-center w-10 h-10 rounded-full"
                >
                    <SendHorizonal size={20}
                    />
                </button>
            </form>
        </>
    );
};