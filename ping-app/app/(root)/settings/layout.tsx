import { ReactNode } from "react";

import * as motion from "framer-motion/client";
import SettingsSidebar from "@/components/settings/settings-sidebar";

interface SettingsLayout {
    children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayout) {
    return (
        <div className="h-full">
            <motion.div
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.2 }}
                className="hidden md:flex h-full w-64 z-20 flex-col fixed inset-y-0">
                <SettingsSidebar />
            </motion.div>
            <main className="h-full md:pl-64">{children}</main>
        </div>
    )
}