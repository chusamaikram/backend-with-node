import { Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";

function PlaylistHeader({ playlist, onEdit, onDelete }) {
  return (
    <header className="flex flex-col sm:flex-row gap-5">
      <div className="w-full sm:w-56 aspect-video rounded-xl overflow-hidden bg-bg-elevated shrink-0">
        <img
          src={playlist.thumbnail?.url}
          alt={playlist.name}
          className="size-full object-cover"
        />
      </div>
      <div className="flex-1 space-y-2">
        <h1 className="text-xl font-bold text-text-primary">{playlist.name}</h1>
        {playlist.description && (
          <p className="text-sm text-text-secondary">{playlist.description}</p>
        )}
        <p className="text-sm text-text-muted">{playlist.videosCount} videos</p>
        <div className="flex gap-2 pt-1">
          <Button variant="secondary" size="sm" onClick={onEdit}>
            <Pencil size={14} aria-hidden="true" /> Edit
          </Button>
          <Button variant="danger" size="sm" onClick={onDelete}>
            <Trash2 size={14} aria-hidden="true" /> Delete
          </Button>
        </div>
      </div>
    </header>
  );
}

export default PlaylistHeader;
