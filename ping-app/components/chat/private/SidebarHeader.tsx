import { Settings } from "lucide-react";
import Header from "../shared/Header";
import { useRouter } from "next/navigation";

interface SidebarHeaderProps {
    isMobileDevice: boolean
}

export default function SidebarHeader({
    isMobileDevice
}: SidebarHeaderProps) {

    const router = useRouter();

    return (
        <div className="w-full">
            {
                isMobileDevice ?
                    <div className="flex items-center justify-between w-full px-4 py-2 mt-4">
                        <h1 className="text-lg font-bold">PING</h1>
                        <Settings
                            size={18}
                            onClick={() => router.push("/settings")}
                        />
                    </div>
                    :
                    <Header />
            }
        </div>
    )
}