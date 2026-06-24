import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getAllVideos } from "@/api/services/video.service";
import { addVideoToPlaylist, removeVideoFromPlaylist } from "@/api/services/playlist.service";
import useAuthStore from "@/store/authStore";
import { formatDuration } from "@/utils/formatDuration";
import Spinner from "@/components/ui/Spinner";
import toast from "react-hot-toast";

function AddVideosModal({ playlist, onClose, onUpdate }) {
    const { user } = useAuthStore();
    const [videos, setVideos]     = useState([]);
    const [loading, setLoading]   = useState(true);
    const [toggling, setToggling] = useState(null);

    // ids of videos already in the playlist
    const inPlaylist = new Set(playlist.videos.map((v) => v._id));

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getAllVideos({ userId: user._id, limit: 50 });
                setVideos(res.data?.docs ?? []);
            } catch {
                toast.error("Failed to load your videos.");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [user._id]);

    async function handleToggle(video) {
        setToggling(video._id);
        const already = inPlaylist.has(video._id);
        try {
            if (already) {
                await removeVideoFromPlaylist(playlist._id, video._id);
                toast.success(`Removed from playlist.`);
            } else {
                await addVideoToPlaylist(playlist._id, video._id);
                toast.success(`Added to playlist.`);
            }
            onUpdate(video, !already); // tell parent to update its videos list
        } catch (err) {
            toast.error(err?.response?.data?.message ?? "Failed to update playlist.");
        } finally {
            setToggling(null);
        }
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-videos-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-lg bg-bg-surface border border-bg-border rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 id="add-videos-title" className="text-base font-semibold text-text-primary">
                        Add Videos to "{playlist.name}"
                    </h2>
                    <button onClick={onClose} aria-label="Close" className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors">
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                <div className="max-h-96 overflow-y-auto space-y-1 -mx-1 px-1">
                    {loading ? (
                        <div className="flex justify-center py-8"><Spinner /></div>
                    ) : videos.length === 0 ? (
                        <p className="text-sm text-text-muted text-center py-6">
                            You haven't uploaded any videos yet.
                        </p>
                    ) : (
                        videos.map((v) => {
                            const checked = inPlaylist.has(v._id);
                            return (
                                <label
                                    key={v._id}
                                    className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-bg-elevated cursor-pointer transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        disabled={toggling === v._id}
                                        onChange={() => handleToggle(v)}
                                        className="size-4 accent-accent rounded shrink-0"
                                    />
                                    <img
                                        src={v.thumbnail?.url}
                                        alt=""
                                        className="w-16 aspect-video object-cover rounded-md shrink-0 bg-bg-border"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-text-primary line-clamp-1">{v.title}</p>
                                        <p className="text-xs text-text-muted mt-0.5">{formatDuration(v.duration)}</p>
                                    </div>
                                    {toggling === v._id && <Spinner size="sm" />}
                                </label>
                            );
                        })
                    )}
                </div>

                <div className="flex justify-end pt-1 border-t border-bg-border">
                    <button
                        onClick={onClose}
                        className="h-8 px-4 text-sm rounded-md bg-bg-elevated text-text-secondary hover:text-text-primary transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddVideosModal;
