import { getUser } from "@/actions/user/getUser";
import { User } from "lucide-react";
import Image from "next/image";

export default async function ChatHeader() {
    const { user } = await getUser();
    return (
        <div className="flex w-full gap-2 p-2 border-b-[1px] border-slate-200 border-opacity-10">
            <div
                className="relative flex mx-3 h-[48px] w-[48px] bg-[#252B2E] items-center justify-center rounded-full overflow-hidden"
            >
                {user?.imageUrl ?
                    <Image
                        fill
                        src={user?.imageUrl}
                        alt="UserProfile" /> :
                    <User className="text-slate-400" />}
            </div>
            <div className="flex flex-col">
                <span>
                    {user?.displayName}
                </span>
                <span className="text-xs text-slate-400">
                    {`@${user?.username}`}
                </span>
            </div>
        </div>
    );
}
