import { getFriendList } from "@/actions/chat/privateChat/getFriendList";
import { getUser } from "@/actions/user/getUser";
import { db } from "@/lib/db";
import { ReactNode } from 'react';
import SeconadaryLayout from "./secondaryLayout";

interface PrivateChatLayoutProps {
    children: ReactNode;
}

export default async function PrivateChatLayout({
    children
}: PrivateChatLayoutProps) {

    const { user } = await getUser();
    const allUsers = await db.user.findMany();
    const friendList = await getFriendList(user?.id!);

    return (
        <SeconadaryLayout
            CurrentuserId={user?.id!}
            friendList={friendList}
            privateChatData={allUsers}>
            {children}
        </SeconadaryLayout>
    );
};
