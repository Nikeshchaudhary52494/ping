import Image from "next/image";

interface MessageItemProps {
    content: string;
    fileUrl?: string;
    isMine: boolean;
}

export default function MessageItem({
    content,
    fileUrl,
    isMine
}: MessageItemProps) {

    return (
        <div className={`${!fileUrl ? `chat-bubble` : `rounded-md`} ${isMine && `chat-bubble-primary text-white`}`}>
            {fileUrl && (
                <div className="relative w-40 h-40">
                    <Image
                        src={fileUrl}
                        alt="Attachment"
                        fill
                        className="p-1 rounded-lg "
                        objectFit="cover"
                    />
                </div>
            )}
            {content && <p className={`${fileUrl && `p-2`}`}>{content}</p>}
        </div>
    );
}
