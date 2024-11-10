import ChatSidebar from '@/components/chat/chat-sidebar';

import * as motion from "framer-motion/client"

import { FC, ReactNode } from 'react';
interface serverIdLayoutProps {
    children: ReactNode;
    params: { serverId: string };
}

const ServerIdLayout: FC<serverIdLayoutProps> = async ({
    children,
}) => {
    return (
        <div className="h-full">
            <motion.div
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.2 }}
                className="hidden md:flex h-full w-64 z-20 flex-col fixed inset-y-0">
                <ChatSidebar />
            </motion.div>
            <main className="h-full md:pl-64">{children}</main>
        </div>
    );
};

export default ServerIdLayout;