import { useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, ListPlus, ChevronDown, ChevronUp } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { formatViews } from "@/utils/formatViews";
import { formatDate } from "@/utils/formatDate";

/**
 * VideoInfo — title, stats, like button, channel row, description.
 */
function VideoInfo({ video }) {
  const [liked, setLiked]           = useState(false);
  const [subscribed, setSubscribed]  = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  return (
    <div className="space-y-4">
      {/* Title */}
      <h1 className="text-lg font-semibold text-text-primary leading-snug">
        {video.title}
      </h1>

      {/* Stats row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-muted">
          {formatViews(video.views)} &middot; {formatDate(video.createdAt)}
        </p>

        <div className="flex items-center gap-2">
          {/* Like */}
          <Button
            variant={liked ? "primary" : "secondary"}
            size="sm"
            onClick={() => setLiked((p) => !p)}
            aria-label={liked ? "Unlike" : "Like"}
          >
            <ThumbsUp size={15} aria-hidden="true" />
            {(video.likesCount + (liked ? 1 : 0)).toLocaleString()}
          </Button>

          {/* Save to playlist */}
          <Button variant="secondary" size="sm" aria-label="Save to playlist">
            <ListPlus size={15} aria-hidden="true" />
            Save
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
            <p className="text-xs text-text-muted">@{video.owner?.username}</p>
          </div>
        </Link>

        <Button
          variant={subscribed ? "secondary" : "primary"}
          size="sm"
          onClick={() => setSubscribed((p) => !p)}
          className="shrink-0"
        >
          {subscribed ? "Subscribed ✓" : "Subscribe"}
        </Button>
      </div>

      {/* Description */}
      <div className="bg-bg-elevated rounded-xl p-4">
        <p className={`text-sm text-text-secondary leading-relaxed whitespace-pre-line ${!descExpanded ? "line-clamp-3" : ""}`}>
          {video.description}
        </p>
        <button
          onClick={() => setDescExpanded((p) => !p)}
          className="mt-2 flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          {descExpanded ? <><ChevronUp size={14} />Show less</> : <><ChevronDown size={14} />Show more</>}
        </button>
      </div>
    </div>
  );
}

export default VideoInfo;
