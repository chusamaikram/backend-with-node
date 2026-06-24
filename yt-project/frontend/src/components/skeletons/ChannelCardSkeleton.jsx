import Skeleton from "./Skeleton";

/**
 * ChannelCardSkeleton — mirrors ChannelCard (centered avatar, name, subscriber count, button).
 * @param {number} count  Number of card skeletons to render (default 8)
 */
function ChannelCardSkeleton({ count = 8 }) {
    return (
        <ul
            aria-label="Loading subscriptions…"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4"
        >
            {Array.from({ length: count }, (_, i) => (
                <li
                    key={i}
                    className="flex flex-col items-center gap-3 bg-bg-elevated rounded-xl p-5"
                >
                    {/* Avatar */}
                    <Skeleton className="size-16 rounded-full" />
                    {/* Name */}
                    <Skeleton className="h-3.5 w-24" />
                    {/* Subscriber count */}
                    <Skeleton className="h-3 w-16" />
                    {/* Subscribe button */}
                    <Skeleton className="h-8 w-24 rounded-lg" />
                </li>
            ))}
        </ul>
    );
}

export default ChannelCardSkeleton;
