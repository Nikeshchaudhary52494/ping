"use client";

import { ReactNode, useEffect, useState } from "react";
import * as motion from "framer-motion/client";
import { usePathname } from "next/navigation";
import SettingsSidebar from "@/components/settings/Sidebar";

interface SeconadaryLayoutProps {
    children: ReactNode;
}

export default function SeconadaryLayout({
    children,
}: SeconadaryLayoutProps) {
    const pathname = usePathname()

    const [screenWidth, setScreenWidth] = useState<number | null>(null);
    console.log(screenWidth)

    // Handle screen resize
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (screenWidth === null) return null;

    const isMobileDevice = screenWidth! < 640;

    if (isMobileDevice) {
        if (pathname.split("/").length > 2) {
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
                    <SettingsSidebar />
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
                    <SettingsSidebar />
                </motion.div>
                <main className="w-full h-full">{children}</main>
            </div>
        )
    }
}