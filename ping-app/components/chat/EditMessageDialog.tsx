import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import EditMessage from '@/actions/chat/shared/editMessage';
import { encryptPrivateMessage } from "@/lib/crypto";
import getUserPublicKey from "@/lib/getUserPublicKeyClient";
import { Edit } from "lucide-react";
import { useMessage } from "@/components/providers/messageProvider";
import { useSocketContext } from "@/components/providers/socketProvider";

interface EditMessageDialogProps {
    originalMessage: string;
    setOpenEditDialog: (value: boolean) => void;
    openEditDialog: boolean;
    messageId: string;
    isGroup?: boolean;
    receiverId?: string;
}

export function EditMessageDialog({
    originalMessage,
    setOpenEditDialog,
    openEditDialog,
    messageId,
    isGroup = false,
    receiverId
}: EditMessageDialogProps) {
    const [editedMessage, setEditedMessage] = useState(originalMessage);
    const [isLoading, setIsLoading] = useState(false);
    const { setMessages } = useMessage();
    const { socket } = useSocketContext();

    const handleEditMessage = async () => {
        if (!editedMessage.trim()) return;
        setIsLoading(true);
        try {

            let encrypted;
            if (isGroup) {
                await EditMessage(messageId, editedMessage, "null");
            } else {
                const storedPrivateKey = localStorage.getItem("pingPrivateKey");
                const receiverPublicKey = await getUserPublicKey(receiverId!);
                encrypted = await encryptPrivateMessage(editedMessage, receiverPublicKey!, storedPrivateKey!);
                await EditMessage(messageId, encrypted.encryptedMessage, encrypted.nonce);
            }
            
            setMessages((prev) => prev.map((msg) => msg.id === messageId ? { ...msg, content: editedMessage, isEdited: true } : msg));
            
            // Update IndexedDB directly
            import("@/lib/indexedDB").then(({ idbMessages }) => {
                idbMessages.update(messageId, { content: editedMessage, isEdited: true });
            });

            if (socket && receiverId) {
                socket.emit("message:edit", { messageId, receiverId, newContent: editedMessage });
            }
            setOpenEditDialog(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={openEditDialog} defaultOpen onOpenChange={setOpenEditDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-sm text-foreground/40">Edit Message</DialogTitle>
                    <DialogDescription className="hidden">
                        Edit your message below.
                    </DialogDescription>
                </DialogHeader>
                <p className="font-medium">{originalMessage}</p>
                <Textarea
                    autoFocus
                    onFocus={(e) => {
                        e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                    }}
                    placeholder="Edit your message..."
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                />
                <Button className="w-full mt-2" onClick={handleEditMessage} disabled={isLoading}>
                    {isLoading ? "Editing..." : "Save Changes"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}