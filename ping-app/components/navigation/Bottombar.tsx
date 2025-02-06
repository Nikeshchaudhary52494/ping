"use client"

import { navigationTabs } from '@/lib/tabLinks';
import { usePathname, useRouter } from 'next/navigation';
import ActionButton from './ActionButton';

export default function Bottombar() {

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
        <div className='flex items-center h-full text-primary border-t border-secondary-foreground/10 bg-secondary py-3 justify-evenly'>
            {
                navigationTabs.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        (pathname.includes(item.route) && item.route.length > 1) ||
                        pathname === item.route;
                    if (item.label == "Settings") return null;
                    return (
                        <div key={item.label} className='flex flex-col items-center'>
                            <button
                                className={`p-2 rounded-full ${isActive && 'bg-primary text-primary-foreground'}`}
                                onClick={() => handleClick(item.route)}
                            >
                                <Icon size={18} strokeWidth={2} />
                            </button>
                            <p className={`text-xs ${isActive && 'text-primary'}`}>{item.label}</p>
                        </div>

                    );
                })
            }
            <div className='flex flex-col items-center'>
                <ActionButton size='sm' />
                <p className="text-xs  text-slate-400">Add</p>
            </div>
        </div>
    );
};