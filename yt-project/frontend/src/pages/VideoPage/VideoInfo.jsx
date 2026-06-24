import { useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, ChevronDown, ChevronUp, Pencil, BookmarkPlus } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { formatViews } from "@/utils/formatViews";
import { formatDate } from "@/utils/formatDate";
import EditVideoModal from "./EditVideoModal";
import SaveToPlaylistModal from "./SaveToPlaylistModal";
import useAuthStore from "@/store/authStore";
import useVideoDetailStore from "@/store/videoDetailStore";
import toast from "react-hot-toast";

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
    const { user } = useAuthStore();
    const { updateVideo } = useVideoDetailStore();
    const [descExpanded, setDescExpanded]     = useState(false);
    const [showEdit, setShowEdit]             = useState(false);
    const [showPlaylist, setShowPlaylist]     = useState(false);
    const [likeAnim, setLikeAnim]             = useState(false);

    function triggerLike() {
        if (!requireAuth("like")) return;
        setLikeAnim(false);
        void document.body.offsetWidth; // reflow
        setLikeAnim(true);
        onLike();
    }

    const isOwner = isLoggedIn && user?._id === video.owner?._id;

    function requireAuth(action) {
        if (!isLoggedIn) {
            toast("Sign in to " + action, { icon: "👋" });
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
                <p className="text-xs text-text-muted">
                    {formatViews(video.views)} &middot; {formatDate(video.createdAt)}
                </p>

                <div className="flex items-center gap-2">
                    {/* Like button */}
                    <Button
                        variant={isLiked ? "primary" : "secondary"}
                        size="sm"
                        onClick={triggerLike}
                        aria-label={isLiked ? "Unlike" : "Like"}
                        className={likeAnim ? "like-pop" : ""}
                        onAnimationEnd={() => setLikeAnim(false)}
                    >
                        <ThumbsUp size={15} aria-hidden="true" />
                        {likesCount > 0 ? likesCount.toLocaleString() : "Like"}
                    </Button>

                    {/* Save to playlist — logged-in users */}
                    {isLoggedIn && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowPlaylist(true)}
                            aria-label="Save to playlist"
                        >
                            <BookmarkPlus size={15} aria-hidden="true" />
                            Save
                        </Button>
                    )}

                    {/* Edit — owner only */}
                    {isOwner && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowEdit(true)}
                            aria-label="Edit video"
                        >
                            <Pencil size={14} aria-hidden="true" />
                            Edit
                        </Button>
                    )}
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

                {/* Hide subscribe button for owner */}
                {!isOwner && (
                    <Button
                        variant={isSubscribed ? "secondary" : "primary"}
                        size="sm"
                        onClick={() => requireAuth("subscribe") && onSubscribe()}
                        className="shrink-0 transition-all duration-200"
                    >
                        <span className="transition-all duration-200">
                            {isSubscribed ? "Subscribed ✓" : "Subscribe"}
                        </span>
                    </Button>
                )}
            </div>

            {/* Description */}
            {video.description && (
                <div className="bg-bg-card border border-border-subtle rounded-xl p-4">
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

            {/* Edit modal */}
            {showEdit && (
                <EditVideoModal
                    video={video}
                    onClose={() => setShowEdit(false)}
                    onSave={(updated) => updateVideo(updated)}
                />
            )}

            {/* Save to playlist modal */}
            {showPlaylist && (
                <SaveToPlaylistModal
                    videoId={video._id}
                    onClose={() => setShowPlaylist(false)}
                />
            )}
        </div>
    );
}

export default VideoInfo;
