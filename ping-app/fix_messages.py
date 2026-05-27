import re

with open("components/chat/Messages.tsx", "r") as f:
    content = f.read()

new_socket = """        socket.on("newMessage", async (newMessage) => {
            const receiverPrivateKey = localStorage.getItem("pingPrivateKey");
            const senderPublicKey = await getUserPublicKey(newMessage.senderId);
            let decryptedText;

            isGroup ?
                decryptedText = newMessage.encryptedContent! :
                decryptedText = await decryptPrivateMessage(
                    newMessage.encryptedContent!,
                    newMessage.nonce,
                    senderPublicKey!,
                    receiverPrivateKey!
                );

            const msgToStore = { ...newMessage, content: decryptedText };
            addMessage(msgToStore);
            updateChatLastMessage(newMessage.chatId, msgToStore);
            await idbMessages.put(msgToStore);
        });

        socket.on("message:delete", async (data) => {
            setMessages((prev) => prev.map(msg => msg.id === data.messageId ? { ...msg, isDeleted: true } : msg));
            await idbMessages.delete(data.messageId);
        });

        socket.on("message:edit", (data) => {
            setMessages((prev) => prev.map(msg => msg.id === data.messageId ? { ...msg, isEdited: true, content: data.newContent } : msg));
        });"""

pattern_socket = re.compile(r'        socket\.on\("newMessage".*?        socket\.on\("message:edit", \(data\) => \{\n            setMessages\(\(prev\) => prev\.map\(msg => msg\.id === data\.messageId \? \{ \.\.\.msg, isEdited: true, encryptedContent: data\.newContent \} : msg\)\);\n        \}\);', re.DOTALL)
content = pattern_socket.sub(new_socket, content)

jsx_pattern = re.compile(r'                const \{ id, encryptedContent, nonce, senderId, fileUrl, status, createdAt, isDeleted, isEdited \} = msg;\n.*?\n                        <MessageItem\n                            messageId=\{id\}\n                            encryptedContent=\{encryptedContent\}\n                            nonce=\{nonce\}\n                            senderId=\{senderId\}', re.DOTALL)

new_jsx = """                const { id, content, senderId, fileUrl, status, createdAt, isDeleted, isEdited } = msg;
                const isFirstMessage = index === 0 || messages[index - 1].senderId !== senderId;
                const isLastMessage = messages[index + 1]?.senderId !== senderId;
                return (
                    <div
                        key={index}
                        className={`flex ${messages.length - 1 == index && `pb-4`} ${userId === senderId ? `justify-end` : `justify-start`}`}>
                        <MessageItem
                            messageId={id}
                            content={content}
                            senderId={senderId}"""
content = jsx_pattern.sub(new_jsx, content)
content = content.replace('import getUserPublicKey from "@/lib/getUserPublicKeyClient";', 'import getUserPublicKey from "@/lib/getUserPublicKeyClient";\nimport { idbMessages } from "@/lib/indexedDB";')
content = content.replace('import { decryptPrivateMessage } from "@/lib/crypto";', 'import { decryptPrivateMessage } from "@/lib/crypto";\nimport { idbMessages } from "@/lib/indexedDB";') # in case I added idbMessages to ChatSection but missed Messages

with open("components/chat/Messages.tsx", "w") as f:
    f.write(content)

