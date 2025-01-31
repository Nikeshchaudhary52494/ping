import { ReactNode } from "react";

import SeconadaryLayout from "./security/secondaryLayout";

interface SettingsLayout {
    children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayout) {
    return (
        <SeconadaryLayout>
            {children}
        </SeconadaryLayout>
    )
}