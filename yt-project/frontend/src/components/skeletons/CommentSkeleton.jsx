import Skeleton from "./Skeleton";

/**
 * CommentSkeleton — mirrors a single comment row (avatar + lines of text).
 * @param {number} count  Number of comment skeletons to render (default 5)
 */
function CommentSkeleton({ count = 5 }) {
    return (
        <div aria-label="Loading comments…" className="space-y-5">
            {/* Matches the "X Comments" heading */}
            <Skeleton className="h-5 w-28" />

            {Array.from({ length: count }, (_, i) => (
                <div key={i} className="flex gap-3">
                    {/* Avatar */}
                    <Skeleton className="size-9 rounded-full shrink-0 mt-0.5" />

                    <div className="flex-1 space-y-2">
                        {/* Name + date row */}
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-3.5 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        {/* Comment body */}
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3.5 w-3/4" />
                        {/* Like / action row */}
                        <Skeleton className="h-3 w-12 mt-1" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CommentSkeleton;
