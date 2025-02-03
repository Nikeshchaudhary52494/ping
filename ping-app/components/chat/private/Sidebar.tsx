import FriendList from "./FriendList";
import Searchbar from "../shared/Searchbar";
import SidebarHeader from "./SidebarHeader";
import { PrivateChat, UserTab } from "@/types/prisma";
import { useEffect, useState } from "react";
import { getPrivateChats } from "@/actions/chat/privateChat/getPrivateChats";
import FriendsSkeleton from "../../skeletons/Friends";
import getSearchData from "@/actions/chat/privateChat/getSearchData";
import Profile from "@/components/skeletons/Profile";

interface SidebarProps {
    CurrentuserId: string;
    isMobileDevice: boolean;
}

export default function Sidebar({
    CurrentuserId,
    isMobileDevice
}: SidebarProps) {

    const [privateChats, setPrivateChats] = useState<PrivateChat[]>([]);
    const [SearchData, setSearchData] = useState<UserTab[]>([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrivateChats = async () => {
            try {
                setLoading(true);
                console.log({ CurrentuserId });
                const [privateChat, searchData] = await Promise.all([
                    getPrivateChats(CurrentuserId),
                    getSearchData(),
                ]);

                setPrivateChats(privateChat || []);
                setSearchData(searchData || []);

            } catch (error) {
                console.error("Error getting Sidebar data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrivateChats();
    }, []);


    return (
        <div className="space-y-4 flex md:border-l-[1px] border-slate-200 border-opacity-10 flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8]">
            {isLoading && !isMobileDevice ?
                <Profile /> :
                <SidebarHeader isMobileDevice={isMobileDevice} />}
            <div className="w-full px-2 my-2">
                <Searchbar
                    type="Private"
                    CurrentuserId={CurrentuserId}
                    searchData={SearchData}
                />
            </div>
            <div className="w-full h-full">
                {isLoading ?
                    <FriendsSkeleton /> :
                    <FriendList
                        privateChats={privateChats}
                    />
                }

            </div>
        </div>
    )
}