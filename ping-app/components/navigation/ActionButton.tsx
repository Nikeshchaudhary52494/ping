import { Plus } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import CreateGroupForm from '../chat/CreateGroupForm';
import { useState } from "react";
import ActionTooltip from "../action-tooltip";
import { Button } from "../ui/button";

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
                        <Button className={`
                            flex  rounded-full group hover:rounded-[16px] bg-primary/20 duration-200 hover:bg-emerald-500
                           ${size === "sm" ? "w-8 h-8 p-2" : "w-12 h-12"}
                        `}>
                            <Plus
                                className="group-hover:text-white text-emerald-500"
                                size={size === "sm" ? 18 : 25}
                            />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="h-full sm:h-fit">
                        <div className="flex flex-col gap-10">
                            <div>
                                <p className="font-bold text-3xl">Create Group</p>
                                <p className="text-sm">Create a group to hang out with your friends!</p>
                            </div>
                            <CreateGroupForm setIsOpen={setIsOpen} />
                        </div>
                    </DialogContent>
                </Dialog>
            </ActionTooltip >
        </>
    );
}
