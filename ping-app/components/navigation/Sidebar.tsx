"use client"

import { Separator } from '../ui/separator';
import { ModeToggle } from '../mode-toggle';
import ActionTooltip from '../action-tooltip';
import { navigationTabs } from '@/lib/tabLinks';
import { usePathname, useRouter } from 'next/navigation';
import ActionButton from './ActionButton';

export default function Sidebar() {

    const pathname = usePathname();
    const router = useRouter();
    const handleClick = (route: string) => {
        if ((pathname.includes(route) && route.length > 1) || pathname === route) {
            router.push('/');
        } else {
            router.push(route);
        }
    }
    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
            <ModeToggle />
            <div className='flex flex-col items-center justify-center flex-1 gap-5 '>
                {
                    navigationTabs.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            (pathname.includes(item.route) && item.route.length > 1) ||
                            pathname === item.route;
                        return (
                            <ActionTooltip key={item.label} side="right" align="center" label={item.label}>
                                <button
                                    className={`p-3 text-slate-400 ${isActive ? 'bg-[#48A6C3] text-white rounded-full' : 'hover:bg-[#48A6C3] hover:bg-opacity-20 rounded-full'}`}
                                    onClick={() => handleClick(item.route)}
                                >
                                    <Icon size={20} strokeWidth={2} />
                                </button>

                            </ActionTooltip>
                        );
                    })
                }
            </div>
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            <div className="flex flex-col items-center pb-3 mt-auto gap-y-4">
                <ActionButton />
            </div>
        </div>
    );
};