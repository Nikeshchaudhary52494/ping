"use client";

import { ReactNode } from "react";
import * as motion from "framer-motion/client";
import Sidebar from "@/components/chat/private/Sidebar";
import { useParams } from "next/navigation";
import useScreenWidth from "@/app/hooks/useScreenWidth";
import { useUser } from "@/components/providers/userProvider";

interface SeconadaryLayoutProps {
    children: ReactNode;
    CurrentuserId: string;
}

export default function SeconadaryLayout({
    children,
    CurrentuserId
}: SeconadaryLayoutProps) {
    const { privateChatId } = useParams();

    const screenWidth = useScreenWidth();
    const { user } = useUser();

    if (screenWidth === null) return null;

    const isMobileDevice = screenWidth < 640;
    if (isMobileDevice) {
        if (privateChatId) {
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
                    className="min-w-80"
                >
                    <Sidebar
                        isMobileDevice={isMobileDevice}
                        CurrentuserId={CurrentuserId}
                    />
                </motion.div>
                <main className="w-full h-full text-center">{children}</main>
            </div>
        )
    }
}