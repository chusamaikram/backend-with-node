import Skeleton from "./Skeleton";

/**
 * VideoTableSkeleton — mirrors VideoTable (thead + tbody rows with thumbnail + columns).
 * @param {number} count  Number of row skeletons to render (default 5)
 */
function VideoTableSkeleton({ count = 5 }) {
    return (
        <div
            aria-label="Loading videos…"
            className="overflow-x-auto rounded-xl border border-bg-border"
        >
            <table className="w-full text-sm">
                <thead className="bg-bg-elevated">
                    <tr>
                        {["Video", "Views", "Likes", "Status", "Date", ""].map((col) => (
                            <th
                                key={col}
                                className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide"
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-bg-border">
                    {Array.from({ length: count }, (_, i) => (
                        <tr key={i}>
                            {/* Thumbnail + title */}
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-20 aspect-video rounded-lg shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-3.5 w-48" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                            </td>
                            {/* Views */}
                            <td className="px-4 py-3"><Skeleton className="h-3.5 w-12" /></td>
                            {/* Likes */}
                            <td className="px-4 py-3"><Skeleton className="h-3.5 w-10" /></td>
                            {/* Status badge */}
                            <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                            {/* Date */}
                            <td className="px-4 py-3"><Skeleton className="h-3.5 w-20" /></td>
                            {/* Action menu */}
                            <td className="px-4 py-3"><Skeleton className="size-7 rounded-md" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default VideoTableSkeleton;
