"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { logoutUser } from "@/actions/user/logoutUser";

const LogoutButton: React.FC = () => {
    const router = useRouter();

    const handleLogout = () => {
        logoutUser();
        console.log("Hello")
    router.refresh();
    };

    return (
        <Button
            className="px-4 py-2 text-sm font-bold text-red-400 duration-200 rounded-lg hover:bg-red-900/50 bg-red-950/50 hover:text-500"
            onClick={handleLogout}
        >
            Sign Out
        </Button>
    );
};

export default LogoutButton;