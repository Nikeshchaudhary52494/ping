import { Skeleton } from "@/components/ui/skeleton";

export default function Chats() {
    return (
        <div className="flex flex-col h-full p-4 space-y-4">
            <div className="flex items-center space-x-4 h-14">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                </div>
            </div>
            <div className="flex items-center space-x-4 h-14">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                </div>
            </div>
            <div className="flex items-center space-x-4 h-14">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                </div>
            </div>
        </div>
    )
}