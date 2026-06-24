import VideoCardSkeleton from "./VideoCardSkeleton";

/**
 * VideoGridSkeleton — same responsive grid as VideoGrid.
 * @param {number} count  Number of card skeletons to render (default 12)
 */
function VideoGridSkeleton({ count = 12 }) {
    return (
        <ul
            aria-label="Loading videos…"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
            {Array.from({ length: count }, (_, i) => (
                <li key={i}>
                    <VideoCardSkeleton layout="grid" />
                </li>
            ))}
        </ul>
    );
}

export default VideoGridSkeleton;
