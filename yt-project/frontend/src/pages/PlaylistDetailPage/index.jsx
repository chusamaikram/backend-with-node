import { useState } from "react";
import { useParams } from "react-router-dom";
import { Trash2, Plus } from "lucide-react";
import Container from "@/layouts/Container";
import PlaylistHeader from "./PlaylistHeader";
import AddVideosModal from "./AddVideosModal";
import VideoCard from "@/components/video/VideoCard";
import Button from "@/components/ui/Button";
import { VideoCardSkeleton, Skeleton } from "@/components/skeletons";
import usePlaylistDetail from "@/hooks/usePlaylistDetail";

function PlaylistDetailPage() {
    const { playlistId } = useParams();
    const { playlist, setPlaylist, loading, error, isOwner, handleEdit, handleDelete, handleRemoveVideo } =
        usePlaylistDetail(playlistId);
    const [showAddVideos, setShowAddVideos] = useState(false);

    // Called by AddVideosModal when a video is toggled
    function handleVideoUpdate(video, added) {
        setPlaylist((prev) => ({
            ...prev,
            videos: added
                ? [...prev.videos, video]
                : prev.videos.filter((v) => v._id !== video._id),
        }));
    }

    if (loading) {
        return (
            <Container as="section" className="py-6 space-y-6">
                <div className="flex flex-col sm:flex-row gap-5">
                    <Skeleton className="w-full sm:w-56 aspect-video rounded-xl shrink-0" />
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-72" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <ul className="space-y-3">
                    {Array.from({ length: 4 }, (_, i) => (
                        <li key={i}><VideoCardSkeleton layout="horizontal" /></li>
                    ))}
                </ul>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-24 text-center">
                <p className="text-5xl mb-4">😕</p>
                <p className="text-lg font-medium text-text-primary">Playlist not found</p>
                <p className="text-sm text-text-muted mt-1">{error}</p>
            </Container>
        );
    }

    return (
        <Container as="section" className="py-6 space-y-6">
            <PlaylistHeader
                playlist={playlist}
                isOwner={isOwner}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Add Videos button — owner only */}
            {isOwner && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-text-muted">
                        {playlist.videos.length} video{playlist.videos.length !== 1 ? "s" : ""}
                    </p>
                    <Button variant="secondary" size="sm" onClick={() => setShowAddVideos(true)}>
                        <Plus size={14} aria-hidden="true" /> Add Videos
                    </Button>
                </div>
            )}

            {playlist.videos.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-text-muted text-sm">This playlist is empty.</p>
                    {isOwner && (
                        <button
                            onClick={() => setShowAddVideos(true)}
                            className="mt-3 text-sm text-accent hover:underline"
                        >
                            Add your first video
                        </button>
                    )}
                </div>
            ) : (
                <ul role="list" className="space-y-3">
                    {playlist.videos.map((v, i) => (
                        <li key={v._id} className="flex items-start gap-4 group">
                            <span className="shrink-0 text-sm text-text-muted w-5 pt-1 text-right">
                                {i + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                                <VideoCard video={v} layout="horizontal" />
                            </div>
                            {isOwner && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveVideo(v._id)}
                                    aria-label="Remove from playlist"
                                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                                >
                                    <Trash2 size={14} className="text-error" aria-hidden="true" />
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {showAddVideos && (
                <AddVideosModal
                    playlist={playlist}
                    onClose={() => setShowAddVideos(false)}
                    onUpdate={handleVideoUpdate}
                />
            )}
        </Container>
    );
}

export default PlaylistDetailPage;
