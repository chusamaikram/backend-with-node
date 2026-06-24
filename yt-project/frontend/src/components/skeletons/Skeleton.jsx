import { cn } from "@/utils/cn";

/**
 * Skeleton — base shimmer block.
 * All skeleton components are built from this primitive.
 */
function Skeleton({ className }) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                "animate-pulse rounded-md bg-bg-elevated",
                className
            )}
        />
    );
}

export default Skeleton;
