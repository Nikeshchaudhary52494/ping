import { ReactNode } from 'react';
import SeconadaryLayout from "./secondaryLayout";
import { verifyToken } from '@/lib/jwtUtils';

interface PrivateChatLayoutProps {
    children: ReactNode;
}

export default async function PrivateChatLayout({
    children
}: PrivateChatLayoutProps) {
    const data = verifyToken();
    return (
        <SeconadaryLayout CurrentuserId={data?.userId!}>
            {children}
        </ SeconadaryLayout>
    );
};