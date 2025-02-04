import { ReactNode } from 'react';
import SeconadaryLayout from "../../../components/chat/secondaryLayout";
import { verifyToken } from '@/lib/jwtUtils';

interface PrivateChatLayoutProps {
    children: ReactNode;
}

export default async function PrivateChatLayout({
    children
}: PrivateChatLayoutProps) {
    const data = verifyToken();
    return (
        <SeconadaryLayout type='Private' CurrentuserId={data?.userId!}>
            {children}
        </ SeconadaryLayout>
    );
};