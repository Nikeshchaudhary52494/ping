"use client";

import { ReactNode, useEffect, useState } from "react";
import * as motion from "framer-motion/client";
import { useParams } from "next/navigation";
import { GroupChat } from "@prisma/client";
import Sidebar from "@/components/chat/group/Sidebar";

interface SeconadaryLayoutProps {
    children: ReactNode;
    CurrentuserId: string;
    groupChatData?: GroupChat[]
}

export default function SeconadaryLayout({
    children,
    CurrentuserId,
    groupChatData
}: SeconadaryLayoutProps) {
    const { groupChatId } = useParams();
    const [screenWidth, setScreenWidth] = useState<number | null>(null);

    // Handle screen resize
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (screenWidth === null) return null;

    const isMobileDevice = screenWidth < 640;
    if (isMobileDevice) {
        if (groupChatId) {
            return (
                <motion.main
                    initial={{ x: 400 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                    exit={{ x: 400 }}
                    className="fixed inset-0 w-full h-full md:static">
                    {children}
                </motion.main>
            );
        } else {
            return (
                <motion.div
                    initial={{ x: -400 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                    exit={{ x: -400 }}
                    className="h-full"
                >
                    <Sidebar
                        isMobileDevice={isMobileDevice}
                        CurrentuserId={CurrentuserId}
                        groupChatData={groupChatData}
                    />
                </motion.div>
            )
        }
    } else {
        return (
            <div className="flex h-full">
                <motion.div
                    initial={{ x: -400 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                    exit={{ x: -400 }}
                    className="min-w-64"
                >
                    <Sidebar
                        isMobileDevice={isMobileDevice}
                        CurrentuserId={CurrentuserId}
                        groupChatData={groupChatData}
                    />
                </motion.div>
                <main className="w-full h-full text-center">{children}</main>
            </div>
        )
    }
}