import Sidebar from "@/components/chat/private/Sidebar";
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
                className="fixed inset-y-0 z-20 flex-col hidden w-64 h-full md:flex">
                <Sidebar />
            </motion.div>
            <main className="h-full md:pl-64">{children}</main>
        </div>
    );
};

export default ServerIdLayout;