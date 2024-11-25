import { Plus } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import ActionTooltip from '../action-tooltip';
import CreateGroupForm from '../groupChat/create-group-form';

export default function NavigationAction() {
    return (
        <div>
            <ActionTooltip side="right" align="center" label="Add">
                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            className="flex items-center group"
                        >
                            <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
                                <Plus
                                    className="transition group-hover:text-white text-emerald-500"
                                    size={25}
                                />
                            </div>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create group</DialogTitle>
                            <DialogDescription>
                                Create a group to handout with your friends!
                            </DialogDescription>
                        </DialogHeader>
                        <CreateGroupForm />
                    </DialogContent>
                </Dialog>
            </ActionTooltip>
        </div>
    );
};
