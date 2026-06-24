import { useState, useEffect } from "react";
import { X, ListVideo, Plus } from "lucide-react";
import { getUserPlaylists, addVideoToPlaylist, removeVideoFromPlaylist, createPlaylist } from "@/api/services/playlist.service";
import useAuthStore from "@/store/authStore";
import Spinner from "@/components/ui/Spinner";
import toast from "react-hot-toast";

function SaveToPlaylistModal({ videoId, onClose }) {
    const { user } = useAuthStore();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [toggling, setToggling]   = useState(null); // playlistId currently being toggled
    const [creating, setCreating]   = useState(false);
    const [newName, setNewName]     = useState("");

    // Fetch user playlists and mark which ones contain this video
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getUserPlaylists(user._id);
                const docs = res.data?.docs ?? [];
                setPlaylists(docs.map((pl) => ({
                    ...pl,
                    hasVideo: pl.videos?.some((v) => v._id === videoId) ?? false,
                })));
            } catch (err) {
                if (err?.response?.status !== 404) {
                    toast.error("Failed to load playlists.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [user._id, videoId]);

    async function handleToggle(playlist) {
        setToggling(playlist._id);
        try {
            if (playlist.hasVideo) {
                await removeVideoFromPlaylist(playlist._id, videoId);
                setPlaylists((prev) => prev.map((pl) =>
                    pl._id === playlist._id ? { ...pl, hasVideo: false } : pl
                ));
                toast.success(`Removed from "${playlist.name}"`);
            } else {
                await addVideoToPlaylist(playlist._id, videoId);
                setPlaylists((prev) => prev.map((pl) =>
                    pl._id === playlist._id ? { ...pl, hasVideo: true } : pl
                ));
                toast.success(`Added to "${playlist.name}"`);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message ?? "Failed to update playlist.");
        } finally {
            setToggling(null);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        if (!newName.trim()) return;
        setCreating(true);
        try {
            const res = await createPlaylist({ name: newName.trim() });
            setPlaylists((prev) => [{ ...res.data, videos: [], hasVideo: false }, ...prev]);
            setNewName("");
            toast.success("Playlist created.");
        } catch (err) {
            toast.error(err?.response?.data?.message ?? "Failed to create playlist.");
        } finally {
            setCreating(false);
        }
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="playlist-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-sm bg-bg-surface border border-bg-border rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 id="playlist-modal-title" className="text-base font-semibold text-text-primary">
                        Save to Playlist
                    </h2>
                    <button onClick={onClose} aria-label="Close" className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors">
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                {/* Playlist list */}
                <div className="max-h-60 overflow-y-auto space-y-1 -mx-1 px-1">
                    {loading ? (
                        <div className="flex justify-center py-6"><Spinner /></div>
                    ) : playlists.length === 0 ? (
                        <p className="text-sm text-text-muted text-center py-4">No playlists yet. Create one below.</p>
                    ) : (
                        playlists.map((pl) => (
                            <label
                                key={pl._id}
                                className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-bg-elevated cursor-pointer transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={pl.hasVideo}
                                    disabled={toggling === pl._id}
                                    onChange={() => handleToggle(pl)}
                                    className="size-4 accent-accent rounded"
                                />
                                <ListVideo size={15} className="text-text-muted shrink-0" aria-hidden="true" />
                                <span className="text-sm text-text-primary truncate flex-1">{pl.name}</span>
                                {toggling === pl._id && <Spinner size="sm" />}
                            </label>
                        ))
                    )}
                </div>

                {/* Create new playlist inline */}
                <form onSubmit={handleCreate} className="flex gap-2 pt-1 border-t border-bg-border">
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="New playlist name…"
                        className="flex-1 h-8 px-3 text-sm rounded-md bg-bg-elevated border border-bg-border
                                   text-text-primary placeholder:text-text-muted
                                   focus:outline-none focus:border-accent transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!newName.trim() || creating}
                        className="h-8 px-3 rounded-md bg-accent text-white text-sm font-medium
                                   hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:pointer-events-none
                                   inline-flex items-center gap-1"
                    >
                        <Plus size={14} aria-hidden="true" /> Create
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SaveToPlaylistModal;
