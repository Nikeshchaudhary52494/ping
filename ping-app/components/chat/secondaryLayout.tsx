"use client";

import { ReactNode } from "react";
import * as motion from "framer-motion/client";
import { useParams } from "next/navigation";
import useScreenWidth from "@/app/hooks/useScreenWidth";
import Sidebar from "@/components/chat/Sidebar";

interface SeconadaryLayoutProps {
    children: ReactNode;
    CurrentuserId: string;
    type: "Private" | "Group";
}

export default function SeconadaryLayout({
    children,
    CurrentuserId,
    type,
}: SeconadaryLayoutProps) {
    const params = useParams();

    const screenWidth = useScreenWidth();

    if (screenWidth === null) return null;

    const isMobileDevice = screenWidth < 640;
    if (isMobileDevice) {
        if (params.groupChatId || params.privateChatId) {
            return (
                <motion.main
                    initial={{ x: 400 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.2 }}
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
                    transition={{ duration: 0.2 }}
                    exit={{ x: -400 }}
                    className="h-full"
                >
                    <Sidebar
                        isMobileDevice={isMobileDevice}
                        CurrentuserId={CurrentuserId}
                        type={type}
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
                    transition={{ duration: 0.2 }}
                    exit={{ x: -400 }}
                    className="min-w-80"
                >
                    <Sidebar
                        isMobileDevice={isMobileDevice}
                        CurrentuserId={CurrentuserId}
                        type={type}
                    />
                </motion.div>
                <main className="w-full h-full text-center">{children}</main>
            </div>
        )
    }
}