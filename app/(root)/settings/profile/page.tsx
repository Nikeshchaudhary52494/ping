import LogoutButton from "@/components/auth/logout-button";
import { currentProfile } from "@/lib/current-profile";
import Image from "next/image";


export default async function Page() {
    const profile = await currentProfile();
    if (!profile) return null;
    return (
        <div className="max-w-lg p-10 space-y-6">
            <h2 className="text-3xl font-bold text-slate-300">Account Details</h2>

            <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 overflow-hidden bg-black rounded-full">
                    <Image
                        src={profile.imageUrl}
                        alt="UserProfile"
                        fill
                    />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800 uppercase">{profile.name}</span>
                    <span className="text-sm text-gray-500">{profile.username}</span>
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
    )
}