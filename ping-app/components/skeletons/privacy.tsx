import { Skeleton } from "../ui/skeleton";

export default function Privacy() {
    return (
        <div className="space-y-4">
            {
                Array(4).fill("").map((_, index) => (
                    <Skeleton key={index} className="h-20" />
                ))
            }
        </div>
    )
}