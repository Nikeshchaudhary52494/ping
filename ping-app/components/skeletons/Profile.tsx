import { Skeleton } from "../ui/skeleton";

export default function Profile() {
    return (
        <div className="flex items-center mt-4 space-x-4 h-14">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
            </div>
        </div>
    )
}