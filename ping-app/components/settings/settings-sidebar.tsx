"use client"

import { settingsTabs } from "@/lib/tabLinks";
import { Separator } from "@radix-ui/react-separator";
import { usePathname, useRouter } from "next/navigation";

export default function SettingsSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const handleClick = (route: string) => {
        router.push(`/settings/${route}`);
    }
    return (
        <div className="space-y-2 flex sm:border-l-[1px] border-slate-200 border-opacity-10 flex-col h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
            <p className="px-4 text-3xl font-extrabold">Setiings</p>
            <Separator className="h-[1px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-full" />
            {
                settingsTabs.map((item, index) => {
                    const Icon = item.icon;
                    const isActive =
                        (pathname.includes(item.route) && item.route.length > 1) ||
                        pathname === item.route;
                    return (
                        <button
                            className={`px-4 py-2 flex gap-2 text-slate-400 ${isActive ? 'bg-[#252B2E]  text-white' : 'hover:bg-[#252B2E] hover:bg-opacity-40'}`}
                            key={index}
                            onClick={() => handleClick(item.route)}
                        >
                            <Icon size={20} strokeWidth={2} />
                            {item.label}
                        </button>
                    );
                })
            }
        </div>
    )
}