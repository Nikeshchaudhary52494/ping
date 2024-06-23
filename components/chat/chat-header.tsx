import { currentProfile } from "@/lib/current-profile";
import Image from "next/image";

export default async function ChatHeader() {
    const profile = await currentProfile();
    if (!profile) return null;

    return (
        <div className="w-full flex gap-2">
            <div
                className="relative flex mx-3 h-[48px] w-[48px] bg-[#252B2E] rounded-full overflow-hidden"
            >
                <Image fill src={profile?.imageUrl} alt="Channel" />
            </div>
            <div className="flex flex-col">
                <span>
                    {profile?.name}
                </span>
                <span className="text-xs text-slate-400">
                    {`@${profile?.username}`}
                </span>
            </div>
        </div>
    );
}
