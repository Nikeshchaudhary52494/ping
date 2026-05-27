"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { logoutUser } from "@/actions/auth/logoutUser";

const LogoutButton: React.FC = () => {
    const router = useRouter();

    const handleLogout = async () => {
        localStorage.removeItem("pingPrivateKey");
        localStorage.removeItem("pingPublicKey");
        await logoutUser();
        router.push("/sign-in");
    };

    return (
        <Button
            className="px-4 py-2 text-sm font-bold"
            onClick={handleLogout}
        >
            Sign Out
        </Button>
    );
};

export default LogoutButton;