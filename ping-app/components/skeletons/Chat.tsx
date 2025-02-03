import { Skeleton } from "@/components/ui/skeleton";

export default function ChatSkeleton() {
    return (
        <div className="flex flex-col h-full p-4 space-y-4 bg-[#0D0D0E] ">
            <div className="flex items-center space-x-4 h-14">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                </div>
            </div>

            <div className="flex-1 space-y-4 ">
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <Skeleton className="h-10 rounded-r-[18px] rounded-bl-[4px] rounded-tl-[18px] w-60 sm:w-80 md:w-62" />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <Skeleton className="h-10 rounded-r-[18px] rounded-l-[4px] w-40 sm:w-80 md:w-96" />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <Skeleton className="h-10 rounded-r-[18px] rounded-bl-[18px] rounded-tl-[4px] w-20 sm:w-80 md:w-40" />
                    </div>

                    <div className="flex justify-end">
                        <Skeleton className="h-10 rounded-l-[18px] rounded-br-[4px] rounded-tr-[18px] w-20 sm:w-80 md:w-96" />
                    </div>

                    <div className="flex justify-end">
                        <Skeleton className="w-40 h-40 rounded-2xl sm:w-80 md:w-44" />
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Skeleton className="flex-1 h-12 rounded-lg" />
                <Skeleton className="w-12 h-12 rounded-lg" />
            </div>
        </div>
    );
}
