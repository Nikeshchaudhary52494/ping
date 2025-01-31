"use client"

import ChatHeader from "../shared/Header";
import FriendList from "./FriendList";
import Searchbar from "../shared/Searchbar";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps {
    CurrentuserId: string,
    privateChatData?: {
        id: string,
        username: string | null
        displayName: string,
        imageUrl: string | null
    }[];
    friendList: any;
    isMobileDevice: boolean
}

export default function Sidebar({
    CurrentuserId,
    privateChatData,
    friendList,
    isMobileDevice
}: SidebarProps) {

    const router = useRouter();

    return (
        <div className="space-y-4 flex md:border-l-[1px] border-slate-200 border-opacity-10 flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8]">
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
                    <ChatHeader />
            }
            <div className="w-full px-2 my-2">
                <Searchbar
                    type="Private"
                    CurrentuserId={CurrentuserId}
                    privateChatData={privateChatData}
                />
            </div>
            <div className="w-full h-full">
                <FriendList
                    friendList={friendList}
                />
            </div>
        </div>
    )
}