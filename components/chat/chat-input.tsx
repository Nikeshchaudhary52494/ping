'use client';

import { Image, SendHorizonal, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useRef, useState, ChangeEvent, FormEvent } from 'react';
import axiosInstance from '@/web-socket-server/src/lib/axiosConfig';
import { useMessage } from '../providers/messageProvider';
import { toast } from '@/app/hooks/use-toast';
import { useUploadThing } from '@/lib/uploadthing';

interface ChatInputProps {
    senderId: string;
    receiverId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ senderId, receiverId }) => {
    const [content, setContent] = useState<string>('');
    const params = useParams();
    const chatId = params?.privateChatId as string;
    const { addMessage } = useMessage();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);
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

        // Check if the content is empty
        if (!content.trim() && files.length === 0) {
            toast({ description: 'Message or image must not be empty.' });
            return;
        }

        let fileUrl = null;

        // Upload the files if any are selected
        if (files.length > 0) {
            try {
                const imgRes = await startUpload(files);
                if (imgRes && imgRes.length > 0) {
                    fileUrl = imgRes[0].url; // Use the first uploaded file URL
                }
            } catch (error) {
                console.error('Failed to upload file:', error);
                toast({ description: 'Failed to upload the file. Please try again.' });
                return; // Exit early since the file upload failed
            }
        }

        try {
            // Reset the input field and image preview
            setContent('');
            setFiles([]);
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

            // Send the message to the server
            const res = await axiosInstance.post(`/api/message/send/${chatId}`, {
                content,
                senderId,
                receiverId,
                fileUrl, // Attach the file URL if it exists
            });

            // Add the new message to the chat
            addMessage(res.data);
        } catch (error) {
            console.error('Failed to send message:', error);
            toast({ description: 'Failed to send message. Please try again later.' });
        }
    };

    return (
        <>
            {imagePreview && (
                <div className="flex items-center gap-2 mb-3">
                    <div className="relative">
                        <img
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
                    className={`flex items-center justify-center w-10 h-10 rounded-full bg-slate-700/20 ${imagePreview ? 'text-emerald-500' : 'text-zinc-400'}`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Image size={20} />
                </button>
                <input
                    type="text"
                    value={content}
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

export default ChatInput;
