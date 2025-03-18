"use client"

import { Separator } from '../ui/separator';
import ActionTooltip from '../action-tooltip';
import { navigationTabs } from '@/lib/tabLinks';
import { usePathname, useRouter } from 'next/navigation';
import ActionButton from './ActionButton';
import { ThemeModeToggle } from '../theme/ModeToggle';

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
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-secondary py-3">
            <ThemeModeToggle onNavBar={true} />
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
                                    className={`p-3 rounded-full ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/40 hover:bg-opacity-20'}`}
                                    onClick={() => handleClick(item.route)}
                                >
                                    <Icon size={20} strokeWidth={2} />
                                </button>

                            </ActionTooltip>
                        );
                    })
                }
            </div>
            <Separator className="h-[2px] w-20 bg-primary rounded-md" />
            <div className="flex flex-col items-center pb-3 mt-auto gap-y-4">
                <ActionButton />
            </div>
        </div>
    );
};