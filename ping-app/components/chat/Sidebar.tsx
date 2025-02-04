import Searchbar from "./Searchbar";
import SidebarHeader from "./SidebarHeader";
import FriendsSkeleton from "../skeletons/Friends";
import Profile from "@/components/skeletons/Profile";
import { useEffect, useState } from "react";
import { getPrivateChats } from "@/actions/chat/privateChat/getPrivateChats";
import { GroupSearchData, UserGroups, PrivateChat, UserTab, GroupChatData } from "@/types/prisma";
import getPrivateSearchData from "@/actions/chat/privateChat/getPrivateSearchData";
import getGroupSearchData from "@/actions/chat/groupChat/getGroupSearchData";
import getUserGroups from "@/actions/chat/groupChat/getUserGroups";
import GroupList from "./GroupList";
import FriendList from "./FriendList";

interface SidebarProps {
    CurrentuserId: string;
    isMobileDevice: boolean;
    type: "Group" | "Private";
}

export default function Sidebar({ CurrentuserId, isMobileDevice, type }: SidebarProps) {
    const [chatData, setChatData] = useState<UserGroups[] | PrivateChat[]>([]);
    const [searchData, setSearchData] = useState<GroupSearchData[] | UserTab[]>([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                setLoading(true);
                if (type === "Group") {
                    const [groupChats, groupSearch] = await Promise.all([
                        getUserGroups(CurrentuserId),
                        getGroupSearchData(),
                    ]);
                    setChatData(groupChats || []);
                    setSearchData(groupSearch || []);
                } else {
                    const [privateChats, privateSearch] = await Promise.all([
                        getPrivateChats(CurrentuserId),
                        getPrivateSearchData(),
                    ]);
                    setChatData(privateChats || []);
                    setSearchData(privateSearch || []);
                }
            } catch (error) {
                console.error("Error fetching sidebar data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [type, CurrentuserId]);

    return (
        <div className="space-y-4 flex sm:border-l-[1px] border-slate-200 border-opacity-10 flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8]">
            {isLoading && !isMobileDevice ?
                <Profile /> :
                <SidebarHeader
                    isMobileDevice={isMobileDevice}
                />}

            <div className="w-full px-2 my-2">
                <Searchbar
                    type={type}
                    CurrentuserId={CurrentuserId}
                    privateSearchData={searchData as UserTab[]}
                    groupSearchData={searchData as GroupSearchData[]}
                />
            </div>
            <div className="w-full overflow-y-auto">
                {isLoading ?
                    <FriendsSkeleton /> :
                    type === "Group" ?
                        <GroupList groupList={chatData as UserGroups[]} /> :
                        <FriendList privateChats={chatData as PrivateChat[]} />
                }
            </div>
        </div>
    );
}
