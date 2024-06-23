"use client"

import { FC } from 'react';
import NavigationAction from './navigation-action';
import { Separator } from '../ui/separator';
import { ModeToggle } from '../mode-toggle';
import ActionTooltip from '../action-tooltip';
import { navigationLinks } from '@/lib/naivationLinks';
import { usePathname, useRouter } from 'next/navigation';

interface navigationSidebarProps { }

const NavigationSidebar: FC<navigationSidebarProps> = async ({ }) => {
    const pathname = usePathname();
    const router = useRouter();
    const handleClick = (route: string) => {
        router.push(route);
    }
    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
            <ModeToggle />
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            <div className='flex-1 flex flex-col gap-5 justify-center items-center '>
                {
                    navigationLinks.map((item) => {
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
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <NavigationAction />
            </div>
        </div>
    );
};

export default NavigationSidebar;