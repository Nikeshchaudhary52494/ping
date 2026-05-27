import Searchbar from "./Searchbar";
import SidebarHeader from "./SidebarHeader";
import FriendsSkeleton from "../skeletons/Chats";
import { useEffect, useState } from "react";
import { getPrivateChats } from "@/actions/chat/privateChat/getPrivateChats";
import { GroupSearchData, UserTab } from "@/types/prisma";
import getPrivateSearchData from "@/actions/chat/privateChat/getPrivateSearchData";
import getUserGroups from "@/actions/chat/groupChat/getUserGroups";
import GroupList from "./GroupList";
import FriendList from "./FriendList";
import getGroupSearchData from "@/actions/chat/groupChat/getGroupSearchData";
import { useChatData } from "../providers/chatDataProvider";
import { idbChats } from "@/lib/indexedDB";

interface SidebarProps {
    CurrentuserId: string;
    isMobileDevice: boolean;
    type: "Group" | "Private";
}

export default function Sidebar({ CurrentuserId, isMobileDevice, type }: SidebarProps) {
    const { setPrivateChats, setGroupList } = useChatData();
    const [searchData, setSearchData] = useState<GroupSearchData[] | UserTab[]>([]);
    const [isLoading, setLoading] = useState(true);


    useEffect(() => {
        const fetchChats = async () => {
            try {
                // Try loading from IndexedDB first
                if (type === "Group") {
                    const localGroups = await idbChats.getGroupChats();
                    if (localGroups.length > 0) {
                        setGroupList(localGroups);
                        setLoading(false); // Render instantly
                    }
                } else {
                    const localPrivate = await idbChats.getPrivateChats();
                    if (localPrivate.length > 0) {
                        setPrivateChats(localPrivate);
                        setLoading(false); // Render instantly
                    }
                }

                // Fetch from network
                if (type === "Group") {
                    const [groupChats, groupSearch] = await Promise.all([
                        getUserGroups(CurrentuserId),
                        getGroupSearchData(),
                    ]);
                    if (groupChats) {
                        setGroupList(groupChats);
                        await idbChats.putGroupChats(groupChats);
                    }
                    setSearchData(groupSearch || []);
                } else {
                    const [privateChats, privateSearch] = await Promise.all([
                        getPrivateChats(CurrentuserId),
                        getPrivateSearchData(),
                    ]);
                    if (privateChats) {
                        setPrivateChats(privateChats);
                        await idbChats.putPrivateChats(privateChats);
                    }
                    setSearchData(privateSearch || []);
                }
            } catch (error) {
                console.error("Error fetching sidebar data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [type, CurrentuserId, setGroupList, setPrivateChats]);

    return (
        <div className="flex flex-col items-center w-full h-full space-y-4 sm:border-x-[1px] border-secondary-foreground/10 border-opacity-10 bg-secondary">
            <SidebarHeader isMobileDevice={isMobileDevice} />
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
                        <GroupList /> :
                        <FriendList />
                }
            </div>
        </div>
    );
}
