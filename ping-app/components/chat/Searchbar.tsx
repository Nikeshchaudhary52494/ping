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
import { GroupSearchData, UserTab } from '@/types/prisma';
import { UserAvatar } from '../user/UserAvatar';

interface SearchbarProps {
    CurrentuserId: string,
    type: 'Group' | 'Private',
    privateSearchData?: UserTab[];
    groupSearchData?: GroupSearchData[];
}

export default function Searchbar({
    CurrentuserId,
    privateSearchData,
    groupSearchData,
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
                className="flex items-center w-full px-2 py-2 transition-all border-primary hover:bg-background/50 border group rounded-xl gap-x-2"
                onClick={() => setOpen(!open)}
            >
                <SearchIcon className="w-4 h-4" />
                <p className="text-sm font-semibold transition">
                    Search
                </p>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-primary text-primary-foreground px-1.5 font-mono text-[10px] font-medium ml-auto">
                    <span className="text-xs ">⌘</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search all channels and members" />
                <CommandList>
                    <CommandEmpty>No Result Found</CommandEmpty>
                    {type === 'Private' ? privateSearchData?.map(({ displayName, id, imageUrl, username }) => (
                        <CommandItem
                            className='cursor-pointer'
                            key={id}
                            onSelect={() => onClick(id, CurrentuserId)}
                        >
                           <UserAvatar imageUrl={imageUrl}/>
                            <div className='flex flex-col'>
                                <span>
                                    {displayName}
                                    {CurrentuserId === id && (
                                        <span>{"  "}(YOU)</span>
                                    )}
                                </span>
                                <span className='text-xs text-slate-400'>{"@" + username}</span>
                            </div>
                        </CommandItem>
                    )) :
                        groupSearchData?.map(({ id, imageUrl, name }) => (
                            <CommandItem
                                className='cursor-pointer'
                                key={id}
                                onSelect={() => { }}
                            >
                                <UserAvatar imageUrl={imageUrl} isGroupAvatar={true} />
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
