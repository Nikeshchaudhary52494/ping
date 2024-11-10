import { Separator } from "@radix-ui/react-dropdown-menu";
import ChatHeader from "./chat-header";
import Searchbar from "./searchbar";
import { getUser } from "@/actions/user/getUser";
import { db } from "@/lib/db";

export default async function ChatSidebar() {
    const { user } = await getUser();
    const allUsers = await db.user.findMany();
    return (
        <div className="space-y-4 flex border-l-[1px] border-slate-200 border-opacity-10 flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8]">
            <ChatHeader />
            <div className="w-full px-2 my-2">
                <Searchbar
                    type="Private"
                    CurrentuserId={user?.id!}
                    privateChatData={allUsers}
                />
            </div>
        </div>
    )
}