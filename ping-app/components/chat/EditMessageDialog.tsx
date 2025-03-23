import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import EditMessage from '@/actions/chat/shared/editMessage';
import { encryptPrivateMessage } from "@/lib/crypto";
import getUserPublicKey from "@/actions/user/getUserPublicKey";
import { Edit } from "lucide-react";

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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={openEditDialog} defaultOpen onOpenChange={setOpenEditDialog}>
            <DialogTrigger>
                <Button size="sm" variant="tab">
                    <p>Edit</p>
                    <Edit size={18} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-sm text-foreground/40">Edit Message</DialogTitle>
                </DialogHeader>
                <p className="font-medium">{originalMessage}</p>
                <Textarea
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