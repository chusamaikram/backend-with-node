import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import {
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    removeVideoFromPlaylist,
} from "@/api/services/playlist.service";
import toast from "react-hot-toast";

function usePlaylistDetail(playlistId) {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!playlistId) return;
        const fetch = async () => {
            try {
                const res = await getPlaylistById(playlistId);
                setPlaylist(res.data);
            } catch (err) {
                setError(err?.response?.data?.message ?? "Failed to load playlist.");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [playlistId]);

    const isOwner = user?._id === playlist?.ownerDetails?._id;

    // ── Edit ──────────────────────────────────────────────────────────────
    const handleEdit = useCallback(async ({ name, description }) => {
        const original = { name: playlist.name, description: playlist.description };
        setPlaylist((p) => ({ ...p, name, description })); // optimistic
        try {
            await updatePlaylist(playlistId, { name, description });
            toast.success("Playlist updated.");
        } catch {
            setPlaylist((p) => ({ ...p, ...original })); // revert
            toast.error("Failed to update playlist.");
        }
    }, [playlistId, playlist]);

    // ── Delete ────────────────────────────────────────────────────────────
    const handleDelete = useCallback(async () => {
        try {
            await deletePlaylist(playlistId);
            toast.success("Playlist deleted.");
            navigate("/playlists");
        } catch (err) {
            toast.error(err?.response?.data?.message ?? "Failed to delete playlist.");
        }
    }, [playlistId, navigate]);

    // ── Remove video ──────────────────────────────────────────────────────
    const handleRemoveVideo = useCallback(async (videoId) => {
        const original = playlist.videos;
        setPlaylist((p) => ({ ...p, videos: p.videos.filter((v) => v._id !== videoId) })); // optimistic
        try {
            await removeVideoFromPlaylist(playlistId, videoId);
        } catch {
            setPlaylist((p) => ({ ...p, videos: original })); // revert
            toast.error("Failed to remove video.");
        }
    }, [playlistId, playlist]);

    return { playlist, setPlaylist, loading, error, isOwner, handleEdit, handleDelete, handleRemoveVideo };
}

export default usePlaylistDetail;
