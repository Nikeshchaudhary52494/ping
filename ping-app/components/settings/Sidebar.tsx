"use client"

import { settingsTabs } from "@/lib/tabLinks";
import { Separator } from "@radix-ui/react-separator";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const handleClick = (route: string) => {
        router.push(`/settings/${route}`);
    }
    return (
        <div className="space-y-2 flex sm:border-l border-secondary-foreground/10 flex-col h-full w-full bg-secondary py-3">
            <p className="px-4 text-3xl text-primary font-extrabold">Setiings</p>
            <Separator className="h-[1px] bg-secondary-foreground/20 rounded-md w-full" />
           <div>
           {
                settingsTabs.map((item, index) => {
                    const Icon = item.icon;
                    const isActive =
                        (pathname.includes(item.route) && item.route.length > 1) ||
                        pathname === item.route;
                    return (
                        <div
                            className={`px-4 py-2 h-20 flex gap-2 hover:bg-primary hover:text-primary-foreground items-center ${isActive && 'bg-primary/80'}`}
                            key={index}
                            onClick={() => handleClick(item.route)}
                        >
                            <Icon size={20} strokeWidth={2} />
                            {item.label}
                        </div>
                    );
                })
            }
           </div>
        </div>
    )
}