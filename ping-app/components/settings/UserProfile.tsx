"use client";

import AccountProfile from "../account-profile";
import LogoutButton from "../auth/logout-button";
import { useUser } from "../providers/userProvider";
import { useRouter } from "next/navigation";
import Userprofile from "../skeletons/UserProfile";

export default function UserProfile() {
    const { user, loading } = useUser();
    const router = useRouter();

    if (!user && !loading) {
        router.push("/sign-in");
    }
    if (!user) {
        return <Userprofile />
    }

    return (
        <div className="flex flex-col items-start h-full p-10 space-y-6 overflow-y-scroll">
            <h2 className="text-3xl font-bold">Account Details</h2>
            <AccountProfile user={user!} btnTitle='Continue' />
            <div className="space-y-2">
                <p>Sign out from device</p>
                <LogoutButton />
            </div>
        </div>
    );
}