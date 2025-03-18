import { getUser } from '@/actions/user/getUser';
import Bottombar from '@/components/navigation/Bottombar';
import Sidebar from '@/components/navigation/Sidebar';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import * as motion from "framer-motion/client";

export default async function MainLayout({
    children,
}: {
    children: ReactNode;
}) {

    const { user } = await getUser();
    if (!user) redirect("/sign-in")
    if (!user?.onboarded) redirect("/onboarding");

    return (
        <div className="flex flex-col h-screen sm:flex-row">
            <aside className="z-10 w-20 hidden h-full sm:block">
                <Sidebar />
            </aside>
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
            <motion.div
                initial={{ x: -400 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.2 }}
                exit={{ x: -400 }}
                className="w-full h-20 sm:hidden">
                <Bottombar />
            </motion.div>
        </div>
    );
};