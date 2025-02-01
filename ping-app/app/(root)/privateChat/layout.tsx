import { getUser } from "@/actions/user/getUser";
import { db } from "@/lib/db";
import { ReactNode } from 'react';
import SeconadaryLayout from "./secondaryLayout";
import { getPrivateChats } from "@/actions/chat/privateChat/getPrivateChats";

interface PrivateChatLayoutProps {
    children: ReactNode;
}

export default async function PrivateChatLayout({
    children
}: PrivateChatLayoutProps) {

    const { user } = await getUser();
    const allUsers = await db.user.findMany();
    const privateChats = await getPrivateChats(user?.id!);

    return (
        <SeconadaryLayout
            CurrentuserId={user?.id!}
            privateChats={privateChats}
            searchData={allUsers}>
            {children}
        </ SeconadaryLayout>
    );
};