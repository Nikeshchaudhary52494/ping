import Searchbar from "../shared/Searchbar";
import GroupList from "./GroupList";
import Header from "../shared/Header";
import { GroupChat } from "@prisma/client";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps {
    CurrentuserId: string,
    isMobileDevice: boolean;
    groupChatData?: GroupChat[]
}
export default function Sidebar({
    CurrentuserId,
    groupChatData,
    isMobileDevice
}: SidebarProps) {

    const router = useRouter();

    return (
        <div className="space-y-4 flex border-l-[1px] border-slate-200 border-opacity-10 flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8]">
            {
                isMobileDevice ?
                    <div className="flex items-center justify-between w-full px-4 py-2 mt-4">
                        <h1 className="text-lg font-bold">PING</h1>
                        <Settings
                            size={18}
                            onClick={() => router.push("/settings")}
                        />
                    </div>
                    :
                    <Header />
            }
            <div className="w-full px-2 my-2">
                <Searchbar
                    type="Group"
                    CurrentuserId={CurrentuserId}
                    groupChatData={groupChatData}
                />
            </div>
            <div className="w-full h-full">
                <GroupList groupList={groupChatData!} />
            </div>
        </div>
    )
}