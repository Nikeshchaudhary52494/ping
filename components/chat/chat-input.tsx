'use client'
import { SendHorizonal } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

const ChatInput = () => {
    const [content, setContent] = useState('');
    const params = useParams();
    const conversationId = params.privateChatId;
    console.log(conversationId);

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (!content.trim()) {
            return;
        }
        try {
            setContent('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <form onSubmit={onSubmit} className="flex bg-[#0D0D0E] border mx-2 rounded-full border-l-[1px] border-slate-200 border-opacity-10">
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-3 bg-transparent outline-none placeholder:text-state-400 placeholder:text-sm"
                required
            />
            <button type="submit" className=""><SendHorizonal className="hover:bg-[#1E1F22] p-2 rounded-full text-slate-400 m-2" size={40} /></button>
        </form>
    );
};

export default ChatInput;
