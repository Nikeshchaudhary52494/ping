import { getUser } from "@/actions/user/getUser";
import LogoutButton from "../auth/logout-button";
import { redirect } from "next/navigation";
import { UserAvatar } from "../user/UserAvatar";

export default async function UserProfile() {
    const { user } = await getUser();
    if (!user) redirect("/sign-in")
    return (
        <div className="max-w-lg p-10 flex flex-col items-start space-y-6">
            <h2 className="text-3xl font-bold">Account Details</h2>

            <div className="flex items-center gap-6">
                  <UserAvatar size={96}/>
                <div className="flex text-start flex-col">
                    <span className="font-bold uppercase">{user?.displayName}</span>
                    <span className="text-sm text-primary">@{user?.username}</span>
                </div>
            </div>

            <div className="space-y-1">
                <p className="font-semibold">Edit Personal Information</p>
                <button className="text-xs text-foreground/40">Change your Profile Name or Email</button>
            </div>

            <button className="text-sm hover:underline">Change Password</button>

            <div className="space-y-2">
                <LogoutButton />
            </div>
        </div>
    );
}
