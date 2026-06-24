import { useState } from "react";
import { Pencil, Trash2, ListVideo, X, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function PlaylistHeader({ playlist, isOwner, onEdit, onDelete }) {
    const [editing, setEditing]   = useState(false);
    const [name, setName]         = useState(playlist.name);
    const [desc, setDesc]         = useState(playlist.description ?? "");
    const [confirming, setConfirming] = useState(false);

    const thumbnail = playlist.videos?.[0]?.thumbnail?.url;
    const count = playlist.videos?.length ?? 0;

    function saveEdit() {
        if (!name.trim()) return;
        onEdit({ name: name.trim(), description: desc.trim() });
        setEditing(false);
    }

    function cancelEdit() {
        setName(playlist.name);
        setDesc(playlist.description ?? "");
        setEditing(false);
    }

    return (
        <header className="flex flex-col sm:flex-row gap-5">
            {/* Thumbnail */}
            <div className="w-full sm:w-56 aspect-video rounded-xl overflow-hidden bg-bg-elevated shrink-0 flex items-center justify-center">
                {thumbnail ? (
                    <img src={thumbnail} alt={playlist.name} className="size-full object-cover" />
                ) : (
                    <ListVideo size={36} className="text-text-muted" aria-hidden="true" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2">
                {editing ? (
                    <div className="space-y-2">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Playlist name"
                        />
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            placeholder="Description (optional)"
                            rows={2}
                            className="w-full px-3 py-2 text-sm rounded-md bg-bg-elevated border border-bg-border
                                       text-text-primary placeholder:text-text-muted resize-none
                                       focus:outline-none focus:border-accent transition-colors"
                        />
                        <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                <X size={13} /> Cancel
                            </Button>
                            <Button size="sm" variant="primary" onClick={saveEdit} disabled={!name.trim()}>
                                <Check size={13} /> Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-xl font-bold text-text-primary">{playlist.name}</h1>
                        {playlist.description && (
                            <p className="text-sm text-text-secondary">{playlist.description}</p>
                        )}
                        <p className="text-sm text-text-muted">{count} video{count !== 1 ? "s" : ""}</p>

                        {isOwner && (
                            <div className="flex gap-2 pt-1">
                                <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                                    <Pencil size={14} aria-hidden="true" /> Edit
                                </Button>

                                {confirming ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-text-muted">Delete playlist?</span>
                                        <Button variant="danger" size="sm" onClick={onDelete}>Yes, delete</Button>
                                        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>Cancel</Button>
                                    </div>
                                ) : (
                                    <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>
                                        <Trash2 size={14} aria-hidden="true" /> Delete
                                    </Button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </header>
    );
}

export default PlaylistHeader;
