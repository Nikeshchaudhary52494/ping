import { Skeleton } from "../ui/skeleton";

export default function Userprofile() {
    return (
        <div className="max-w-lg p-10 space-y-4">
            <Skeleton className="w-1/2 h-10" />
            <div className="flex items-center gap-10">
                <Skeleton className="rounded-full w-28 h-28" />
                <Skeleton className="w-1/2 h-10" />
            </div>
            <div className="space-y-2">
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-40" />
            </div>
        </div>
    )
}