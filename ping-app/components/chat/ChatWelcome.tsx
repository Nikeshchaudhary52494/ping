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
        <div className="px-4 mb-4 flex items-start text-start flex-col space-y-2">
            {type === 'group' && (
                <div className="h-[75px] w-[75px] rounded-full bg-secondary flex items-center justify-center">
                    <Hash size={48} />
                </div>
            )}
            <div>
                <p className="text-xl font-bold md:text-3xl ">
                    {type === 'group' && 'Welcome to #'}
                    {name}
                </p>
                <p className="text-sm text-foreground/40">
                    {type === 'group'
                        ? `This is the start of the #${name} channel.`
                        : `This is the start of your conversation with ${name}`}
                </p>
            </div>
        </div>
    );
};