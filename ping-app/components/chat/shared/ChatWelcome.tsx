import { Hash } from 'lucide-react';

interface ChatWelcomeProps {
    name: string;
    type: 'private' | 'group';
}

export default function ChatWelcome({
    name,
    type
}: ChatWelcomeProps) {

    return (
        <div className="px-4 mb-4 space-y-2">
            {type === 'group' && (
                <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
                    <Hash className="w-12 h-12 text-white" />
                </div>
            )}
            <p className="text-xl font-bold md:text-3xl ">
                {type === 'group' && 'Welcome to #'}
                {name}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {type === 'group'
                    ? `This is the start of the #${name} channel.`
                    : `This is the start of your conversation with ${name}`}
            </p>
        </div>
    );
};