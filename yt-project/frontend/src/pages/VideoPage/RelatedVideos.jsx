import { useEffect, useState } from "react";
import VideoCard from "@/components/video/VideoCard";
import { VideoCardSkeleton } from "@/components/skeletons";
import { getAllVideos } from "@/api/services/video.service";

/**
 * RelatedVideos — fetches a general feed of videos, excludes the current one.
 *
 * Why local useState here and not a store?
 *   Related videos are ephemeral — they only matter while this video page
 *   is open. There's no need to cache them across navigation. Local state
 *   is the right tool when data doesn't need to outlive the component.
 *
 * @param {string} currentVideoId — excluded from the list
 */
function RelatedVideos({ currentVideoId }) {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false; // prevent stale state update if component unmounts

        const fetch = async () => {
            setLoading(true);
            try {
                const res = await getAllVideos({ limit: 10, sortBy: "createdAt", sortType: "desc" });
                if (!cancelled) {
                    // Filter out the current video from related list
                    const filtered = res.data.docs.filter((v) => v._id !== currentVideoId);
                    setVideos(filtered.slice(0, 8));
                }
            } catch {
                // Silently fail — related videos are non-critical
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetch();

        return () => { cancelled = true; };
    }, [currentVideoId]);

    return (
        <aside aria-label="Related videos">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">
                Up Next
            </h2>

            {loading ? (
                <ul role="list" className="space-y-3">
                    {Array.from({ length: 6 }, (_, i) => (
                        <li key={i}>
                            <VideoCardSkeleton layout="horizontal" />
                        </li>
                    ))}
                </ul>
            ) : (
                <ul role="list" className="space-y-3">
                    {videos.map((video) => (
                        <li key={video._id}>
                            <VideoCard video={video} layout="horizontal" />
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
}

export default RelatedVideos;
