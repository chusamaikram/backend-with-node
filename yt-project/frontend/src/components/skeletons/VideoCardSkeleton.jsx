import { cn } from "@/utils/cn";
import Skeleton from "./Skeleton";

/**
 * VideoCardSkeleton — mirrors VideoCard layout (grid + horizontal).
 * Usage: <VideoCardSkeleton layout="grid" /> or layout="horizontal"
 */
function VideoCardSkeleton({ layout = "grid" }) {
    const isHorizontal = layout === "horizontal";

    return (
        <div className={cn("rounded-xl overflow-hidden", isHorizontal && "flex gap-3")}>
            {/* Thumbnail */}
            <Skeleton
                className={cn(
                    "shrink-0 rounded-xl",
                    isHorizontal ? "w-40 aspect-video sm:w-48" : "w-full aspect-video"
                )}
            />

            {/* Info */}
            <div className={cn("flex gap-3 min-w-0 flex-1", !isHorizontal && "mt-3")}>
                {/* Avatar — grid only */}
                {!isHorizontal && <Skeleton className="size-9 rounded-full shrink-0 mt-0.5" />}

                <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-3 w-2/5" />
                </div>
            </div>
        </div>
    );
}

export default VideoCardSkeleton;
