import FriendList from "./FriendList";
import Searchbar from "../shared/Searchbar";
import SidebarHeader from "./SidebarHeader";
import { PrivateChat } from "@/types/prisma";

interface SidebarProps {
    CurrentuserId: string,
    SearchData?: {
        id: string,
        username: string | null
        displayName: string,
        imageUrl: string | null
    }[];
    privateChats: PrivateChat[];
    isMobileDevice: boolean
}

export default function Sidebar({
    CurrentuserId,
    SearchData,
    privateChats,
    isMobileDevice
}: SidebarProps) {

    return (
        <div className="space-y-4 flex md:border-l-[1px] border-slate-200 border-opacity-10 flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8]">
            <SidebarHeader isMobileDevice={isMobileDevice} />
            <div className="w-full px-2 my-2">
                <Searchbar
                    type="Private"
                    CurrentuserId={CurrentuserId}
                    searchData={SearchData}
                />
            </div>
            <div className="w-full h-full">
                <FriendList
                    privateChats={privateChats}
                />
            </div>
        </div>
    )
}