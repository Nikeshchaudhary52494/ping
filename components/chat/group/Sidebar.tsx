import { getUser } from "@/actions/user/getUser";
import { db } from "@/lib/db";
import Searchbar from "../shared/Searchbar";
import GroupList from "./GroupList";
import Header from "../shared/Header";


export default async function Sidebar() {
    
    const { user } = await getUser();
    const myGroup = await db.groupChat.findMany({
        where: {
            members: {
                some: {
                    id: user?.id
                }
            }
        }
    });

    return (
        <div className="space-y-4 flex border-l-[1px] border-slate-200 border-opacity-10 flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8]">
            <Header />
            <div className="w-full px-2 my-2">
                <Searchbar
                    type="Group"
                    CurrentuserId={user?.id!}
                    groupChatData={myGroup}
                />
            </div>
            <div className="w-full h-full">
                <GroupList groupList={myGroup} />
            </div>
        </div>
    )
}