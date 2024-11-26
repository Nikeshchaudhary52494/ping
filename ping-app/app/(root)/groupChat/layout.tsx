import { ReactNode } from 'react';
import * as motion from "framer-motion/client"
import Sidebar from '@/components/chat/group/Sidebar';

interface GroupChatLayoutProps {
    children: ReactNode;
}

export default function GroupChatLayout({ children }: GroupChatLayoutProps) {
    return (
        <div className="h-full">
            <motion.div
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-y-0 z-20 flex-col hidden w-64 h-full md:flex">
                <Sidebar />
            </motion.div>
            <main className="h-full md:pl-64">{children}</main>
        </div>
    );
};
