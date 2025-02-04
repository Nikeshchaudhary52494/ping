import { Plus } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import CreateGroupForm from '../chat/CreateGroupForm';
import { cn } from "@/lib/utils";
import { useState } from "react";
import ActionTooltip from "../action-tooltip";

interface ActionButtonProps {
    size?: "sm";
}

export default function ActionButton({
    size
}: ActionButtonProps) {

    const [isopen, setIsOpen] = useState(false);

    return (
        <>
            <ActionTooltip label="Create Group">
                <Dialog open={isopen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <button className="flex items-center group">
                            <div
                                className={cn(
                                    "flex mx-3 rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500",
                                    size === "sm" ? "w-8 h-8 p-2" : "w-12 h-12"
                                )}
                            >
                                <Plus
                                    className="transition group-hover:text-white text-emerald-500"
                                    size={size === "sm" ? 18 : 25}
                                />
                            </div>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="h-full sm:h-fit">
                        <div className="flex flex-col gap-10">
                            <div>
                                <p className="font-bold text-3xl">Create Group</p>
                                <p className="text-slate-400 text-sm">Create a group to hang out with your friends!</p>
                            </div>
                            <div>
                                <CreateGroupForm setIsOpen={setIsOpen} />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </ActionTooltip>
        </>
    );
}
