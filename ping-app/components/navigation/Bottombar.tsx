"use client"

import { navigationTabs } from '@/lib/tabLinks';
import { usePathname, useRouter } from 'next/navigation';

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
        <div className='flex items-center border-t-[1px] border-slate-200 border-opacity-10 dark:bg-[#1E1F22] bg-[#E3E5E8] py-3 justify-evenly'>
            {
                navigationTabs.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        (pathname.includes(item.route) && item.route.length > 1) ||
                        pathname === item.route;
                    if (item.label == "Settings") return null;
                    return (
                        <div className='flex flex-col items-center'>
                            <button
                                className={`p-2 text-slate-400 ${isActive ? 'bg-[#48A6C3] text-white rounded-full' : 'hover:bg-[#48A6C3] hover:bg-opacity-20 rounded-full'}`}
                                onClick={() => handleClick(item.route)}
                            >
                                <Icon size={18} strokeWidth={2} />
                            </button>
                            <p className={`text-xs  text-slate-400  ${isActive && 'text-[#48A6C3]'}`}>{item.label}</p>
                        </div>

                    );
                })
            }
        </div>
    );
};