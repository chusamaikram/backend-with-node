import { Link } from "react-router-dom";
import { ListVideo } from "lucide-react";

function PlaylistCard({ playlist }) {
  return (
    <article className="group rounded-xl overflow-hidden bg-bg-elevated hover:bg-bg-border transition-colors">
      <Link to={`/playlists/${playlist._id}`}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={playlist.thumbnail?.url}
            alt={playlist.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ListVideo size={32} className="text-white" aria-hidden="true" />
          </div>
          <span className="absolute bottom-2 right-2 bg-black/75 text-white text-xs font-mono px-1.5 py-0.5 rounded">
            {playlist.videosCount} videos
          </span>
        </div>
      </Link>
      <div className="p-3">
        <Link to={`/playlists/${playlist._id}`}>
          <h3 className="text-sm font-semibold text-text-primary hover:text-accent transition-colors line-clamp-1">
            {playlist.name}
          </h3>
        </Link>
        {playlist.description && (
          <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{playlist.description}</p>
        )}
      </div>
    </article>
  );
}

export default PlaylistCard;
