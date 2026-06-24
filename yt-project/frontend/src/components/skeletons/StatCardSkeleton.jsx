import Skeleton from "./Skeleton";

/**
 * StatCardSkeleton — mirrors StatCard (icon box on left, large value + label on right).
 * @param {number} count  Number of stat card skeletons to render (default 4)
 */
function StatCardSkeleton({ count = 4 }) {
    return (
        <ul
            aria-label="Loading stats…"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        >
            {Array.from({ length: count }, (_, i) => (
                <li
                    key={i}
                    className="bg-bg-elevated rounded-xl p-5 flex items-center gap-4"
                >
                    {/* Icon box */}
                    <Skeleton className="size-12 rounded-lg shrink-0" />
                    <div className="space-y-2 flex-1">
                        {/* Value */}
                        <Skeleton className="h-7 w-20" />
                        {/* Label */}
                        <Skeleton className="h-3.5 w-28" />
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default StatCardSkeleton;
