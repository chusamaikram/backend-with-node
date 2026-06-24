import { Link } from "react-router-dom";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { formatDuration } from "@/utils/formatDuration";
import { formatViews } from "@/utils/formatViews";
import { formatDate } from "@/utils/formatDate";
import { cn } from "@/utils/cn";

/**
 * VideoCard
 * @param {object}           video    - video object from API / mock data
 * @param {"grid"|"horizontal"} layout
 */
function VideoCard({ video, layout = "grid" }) {
  const isHorizontal = layout === "horizontal";

  return (
    <article
      className={cn(
        "group rounded-xl overflow-hidden",
        isHorizontal && "flex gap-3"
      )}
    >
      {/* Thumbnail */}
      <Link
        to={`/watch/${video._id}`}
        className={cn(
          "relative block shrink-0 overflow-hidden rounded-xl bg-bg-elevated",
          isHorizontal ? "w-40 aspect-video sm:w-48" : "w-full aspect-video"
        )}
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={video.thumbnail?.url}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Duration badge */}
        <Badge
          variant="default"
          className="absolute bottom-1.5 right-1.5"
        >
          {formatDuration(video.duration)}
        </Badge>
      </Link>

      {/* Info */}
      <div className={cn("flex gap-3 min-w-0", !isHorizontal && "mt-3")}>
        {/* Channel avatar — only in grid layout */}
        {!isHorizontal && (
          <Link to={`/channel/${video.owner?.username}`} className="shrink-0 mt-0.5" tabIndex={-1}>
            <Avatar
              src={video.owner?.avatar}
              alt={video.owner?.fullname}
              fallback={video.owner?.username?.[0] ?? "?"}
              size="sm"
            />
          </Link>
        )}

        {/* Text */}
        <div className="min-w-0 flex-1">
          <Link to={`/watch/${video._id}`}>
            <h3
              className={cn(
                "font-medium text-text-primary leading-snug line-clamp-2",
                "group-hover:text-white transition-colors duration-150",
                isHorizontal ? "text-sm" : "text-sm"
              )}
            >
              {video.title}
            </h3>
          </Link>

          <Link
            to={`/channel/${video.owner?.username}`}
            className="mt-1 block text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            {video.owner?.fullname}
          </Link>

          <p className="mt-0.5 text-xs text-text-muted">
            {formatViews(video.views)} &middot; {formatDate(video.createdAt)}
          </p>

          {/* Description — horizontal layout only */}
          {isHorizontal && (
            <p className="mt-1.5 text-xs text-text-muted line-clamp-2 hidden sm:block">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export default VideoCard;
