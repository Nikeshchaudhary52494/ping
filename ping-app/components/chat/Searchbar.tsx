import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    CommandDialog,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { useRouter } from 'next/navigation';
import { GroupSearchData, PrivateChat, UserGroups, UserTab } from '@/types/prisma';
import { UserAvatar } from '../user/UserAvatar';
import { useChatData } from '../providers/chatDataProvider';
import { getOrCreatePrivateChat } from '@/actions/chat/privateChat/getOrCreatePrivateChatId';
import getGroupByChatId from '@/actions/chat/groupChat/getGroupById';
import getGroupOrAddMember from '@/actions/chat/groupChat/getGroupOrAddMember';

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
    const { addPrivateChat, addGroup } = useChatData();

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

    const handleSelectUser = async (memberOne: string, memberTwo: string) => {
        const privateChat = await getOrCreatePrivateChat(memberOne, memberTwo);
        addPrivateChat(privateChat as PrivateChat);
        setOpen(!open);
        router.push(`/privateChat/${privateChat.id}`);
    };

    const handleSelectGroup = async (chatId: string) => {
        const group = await getGroupOrAddMember(chatId, CurrentuserId);
        addGroup(group as UserGroups);
        setOpen(!open);
        router.push(`/groupChat/${chatId}`);
    }

    return (
        <>
            <button
                className="flex items-center w-full px-2 py-2 transition-all border border-primary hover:bg-background/50 group rounded-xl gap-x-2"
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
                            onSelect={() => handleSelectUser(CurrentuserId, id)}>
                            <UserAvatar imageUrl={imageUrl} />
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
                        groupSearchData?.map(({ chatId, imageUrl, name }) => (
                            <CommandItem
                                className='cursor-pointer'
                                key={chatId}
                                onSelect={() => handleSelectGroup(chatId)}
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
            </CommandDialog >
        </>
    );
};