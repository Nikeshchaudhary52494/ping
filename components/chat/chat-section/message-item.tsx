interface MessageItemProps {
    content: string;
    isMine: boolean;
}

export default function MessageItem({ content, isMine }: MessageItemProps) {
    return (
        <div className={`p-4 border rounded-b-lg max-w-xs ${isMine ? 'bg-[#48A6C3] rounded-tl-md text-black self-end' : 'bg-[#252B2E] rounded-tr-lg text-slate-300 self-start'}`}>
            {content}
        </div>
    )
}
