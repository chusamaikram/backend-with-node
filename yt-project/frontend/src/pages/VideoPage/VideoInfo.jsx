import { useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { formatViews } from "@/utils/formatViews";
import { formatDate } from "@/utils/formatDate";
import toast from "react-hot-toast";

/**
 * VideoInfo — title, stats, like button, channel row, description.
 *
 * All like/subscribe state lives in useVideoDetail (via videoDetailStore).
 * This component is purely presentational — it receives state as props
 * and calls handler functions. No local state for server data.
 *
 * The only local state here is `descExpanded` — purely UI, belongs here.
 */
function VideoInfo({
    video,
    isLiked,
    likesCount,
    isSubscribed,
    subscribersCount,
    onLike,
    onSubscribe,
    isLoggedIn,
}) {
    const [descExpanded, setDescExpanded] = useState(false);

    function requireAuth(action) {
        if (!isLoggedIn) {
            toast("Sign in to " + action, {
                icon: "👋",
            });
            return false;
        }
        return true;
    }

    return (
        <div className="space-y-4">

            {/* Title */}
            <h1 className="text-lg font-semibold text-text-primary leading-snug">
                {video.title}
            </h1>

            {/* Stats + actions row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-text-muted">
                    {formatViews(video.views)} &middot; {formatDate(video.createdAt)}
                </p>

                <div className="flex items-center gap-2">
                    <Button
                        variant={isLiked ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => requireAuth("like") && onLike()}
                        aria-label={isLiked ? "Unlike" : "Like"}
                    >
                        <ThumbsUp size={15} aria-hidden="true" />
                        {likesCount > 0 ? likesCount.toLocaleString() : "Like"}
                    </Button>
                </div>
            </div>

            {/* Channel row */}
            <div className="flex items-center justify-between gap-4 py-3 border-y border-bg-border">
                <Link
                    to={`/channel/${video.owner?.username}`}
                    className="flex items-center gap-3 min-w-0"
                >
                    <Avatar
                        src={video.owner?.avatar}
                        alt={video.owner?.fullname}
                        fallback={video.owner?.username?.[0] ?? "?"}
                        size="md"
                    />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">
                            {video.owner?.fullname}
                        </p>
                        <p className="text-xs text-text-muted">
                            {subscribersCount.toLocaleString()} subscribers
                        </p>
                    </div>
                </Link>

                {/* Subscribe button — same for guests and logged in users */}
                <Button
                    variant={isSubscribed ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => requireAuth("subscribe") && onSubscribe()}
                    className="shrink-0"
                >
                    {isSubscribed ? "Subscribed ✓" : "Subscribe"}
                </Button>
            </div>

            {/* Description */}
            {video.description && (
                <div className="bg-bg-elevated rounded-xl p-4">
                    <p
                        className={`text-sm text-text-secondary leading-relaxed whitespace-pre-line ${
                            !descExpanded ? "line-clamp-3" : ""
                        }`}
                    >
                        {video.description}
                    </p>
                    <button
                        onClick={() => setDescExpanded((p) => !p)}
                        className="mt-2 flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
                    >
                        {descExpanded ? (
                            <><ChevronUp size={14} aria-hidden="true" /> Show less</>
                        ) : (
                            <><ChevronDown size={14} aria-hidden="true" /> Show more</>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

export default VideoInfo;
