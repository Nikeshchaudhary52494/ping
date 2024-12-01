import { getUser } from "@/actions/user/getUser";
import LogoutButton from "../auth/logout-button";
import Image from "next/image";
import { User } from "lucide-react";
import { redirect } from "next/navigation";

export default async function UserProfile() {
    const { user } = await getUser();
    if (!user) redirect("/sign-in")
    return (
        <div className="max-w-lg p-10 space-y-6">
            <h2 className="text-3xl font-bold text-slate-300">Account Details</h2>

            <div className="flex items-center gap-6">
                <div className="relative flex items-center justify-center w-20 h-20 overflow-hidden bg-black rounded-full">
                    {user?.imageUrl ?
                        <Image
                            src={user?.imageUrl}
                            className="object-cover"
                            alt="UserProfile"
                            fill
                        /> :
                        <User
                            className="text-slate-400"
                            size={40} />
                    }
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800 uppercase">{user?.displayName}</span>
                    <span className="text-sm text-gray-500">{user?.username}</span>
                </div>
            </div>

            <div className="space-y-1">
                <p className="font-semibold text-gray-700">Edit Personal Information</p>
                <button className="text-xs text-slate-400">Change your Profile Name or Email</button>
            </div>

            <button className="text-sm text-slate-400 hover:underline">Change Password</button>

            <div className="space-y-2">
                <LogoutButton />
            </div>
        </div>
    );
}
