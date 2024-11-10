"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const LogoutButton: React.FC = () => {
    const router = useRouter();

    const handleLogout = async () => {
    };

    return (
        <Button
            className="px-4 py-2 text-sm font-bold text-red-400 rounded-lg bg-red-950/50 hover:underline"
            onClick={handleLogout}
        >
            Sign Out
        </Button>
    );
};

export default LogoutButton;