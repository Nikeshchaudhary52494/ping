import { ReactNode } from 'react';
import SeconadaryLayout from './secondaryLayout';
import { getUser } from '@/actions/user/getUser';
import { db } from '@/lib/db';

interface GroupChatLayoutProps {
    children: ReactNode;
}

export default async function GroupChatLayout({ children }: GroupChatLayoutProps) {
    const { user } = await getUser();
    const myGroup = await db.groupChat.findMany({
        where: {
            members: {
                some: {
                    id: user?.id
                }
            }
        }
    });
    return (
        <SeconadaryLayout
            CurrentuserId={user?.id!}
            groupChatData={myGroup} >
            {children}
        </SeconadaryLayout>
    );
};
