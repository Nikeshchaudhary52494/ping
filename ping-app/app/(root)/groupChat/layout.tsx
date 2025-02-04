import { ReactNode } from 'react';
import { verifyToken } from '@/lib/jwtUtils';
import SeconadaryLayout from '@/components/chat/secondaryLayout';

interface GroupChatLayoutProps {
    children: ReactNode;
}

export default async function GroupChatLayout({
    children
}: GroupChatLayoutProps) {

    const data = verifyToken();
    return (
        <SeconadaryLayout
            type='Group'
            CurrentuserId={data?.userId!}>
            {children}
        </ SeconadaryLayout>
    );
};
