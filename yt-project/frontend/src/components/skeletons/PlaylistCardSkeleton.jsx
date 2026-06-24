import Skeleton from "./Skeleton";

/**
 * PlaylistCardSkeleton — mirrors PlaylistCard (aspect-video thumbnail + title + description).
 * @param {number} count  Number of card skeletons to render (default 8)
 */
function PlaylistCardSkeleton({ count = 8 }) {
    return (
        <ul
            aria-label="Loading playlists…"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
            {Array.from({ length: count }, (_, i) => (
                <li key={i} className="rounded-xl overflow-hidden bg-bg-elevated">
                    {/* Thumbnail */}
                    <Skeleton className="w-full aspect-video rounded-none" />
                    {/* Title + description */}
                    <div className="p-3 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default PlaylistCardSkeleton;
