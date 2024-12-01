'use client';

import { SearchIcon, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    CommandDialog,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getOrCreatePrivateChatId } from '@/actions/chat/privateChat/getOrCreatePrivateChatId';
import { GroupChat } from '@prisma/client';

interface SearchbarProps {
    CurrentuserId: string,
    type: 'Group' | 'Private',
    privateChatData?: {
        id: string,
        username: string | null
        displayName: string,
        imageUrl: string | null
    }[];
    groupChatData?: GroupChat[]
}

export default function Searchbar({
    groupChatData,
    privateChatData,
    CurrentuserId,
    type
}: SearchbarProps) {

    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => {
            document.removeEventListener('keydown', down);
        };
    }, []);

    const onClick = async (memberOne: string, memberTwo: string) => {
        const privateChatId = await getOrCreatePrivateChatId(memberOne, memberTwo);
        router.push(`/privateChat/${privateChatId}`);
    };

    return (
        <>
            <button
                className="flex items-center w-full px-2 py-2 transition-all border group border-slate-400/50 rounded-xl gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
                onClick={() => setOpen(!open)}
            >
                <SearchIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <p className="text-sm font-semibold transition text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                    Search
                </p>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                    <span className="text-xs ">⌘</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search all channels and members" />
                <CommandList>
                    <CommandEmpty>No Result Found</CommandEmpty>
                    {type === 'Private' ? privateChatData?.map(({ displayName, imageUrl, username, id: userId }) => (
                        <CommandItem
                            className='cursor-pointer'
                            key={username}
                            onSelect={() => onClick(userId, CurrentuserId)}
                        >
                            <div
                                className="relative flex mx-3 h-[48px] w-[48px] bg-[#252B2E] items-center justify-center rounded-full overflow-hidden"
                            >
                                {imageUrl ?
                                    <Image
                                        fill
                                        src={imageUrl}
                                        alt="UserProfile" /> :
                                    <User className="text-slate-400" />}
                            </div>
                            <div className='flex flex-col'>
                                <span>
                                    {displayName}
                                    {CurrentuserId === userId && (
                                        <span>{"  "}(YOU)</span>
                                    )}
                                </span>
                                <span className='text-xs text-slate-400'>{"@" + username}</span>
                            </div>
                        </CommandItem>
                    )) :
                        groupChatData?.map(({ name, id, imageUrl }) => (
                            <CommandItem
                                className='cursor-pointer'
                                key={id}
                                onSelect={() => { }}
                            >
                                <div
                                    className="relative flex mx-3 h-[48px] w-[48px] bg-[#252B2E] rounded-full overflow-hidden"
                                >
                                    <Image 
                                    layout="fill"
                                     className='object-contain p-1 bg-white' 
                                     src={imageUrl || "/group.png"} 
                                     alt={name} />
                                </div>
                                <div className='flex flex-col'>
                                    <span>
                                        {name}
                                    </span>
                                </div>
                            </CommandItem>
                        ))
                    }
                </CommandList>
            </CommandDialog>
        </>
    );
};
