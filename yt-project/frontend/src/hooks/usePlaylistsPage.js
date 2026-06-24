import { useState, useEffect, useCallback } from "react";
import useAuthStore from "@/store/authStore";
import { getUserPlaylists, createPlaylist } from "@/api/services/playlist.service";
import toast from "react-hot-toast";

function usePlaylistsPage() {
    const { user } = useAuthStore();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user?._id) return;

        const fetch = async () => {
            try {
                const res = await getUserPlaylists(user._id);
                setPlaylists(res.data.docs ?? []);
            } catch (err) {
                // Backend throws 404 when no playlists — treat as empty, not error
                if (err?.response?.status === 404) {
                    setPlaylists([]);
                } else {
                    setError(err?.response?.data?.message ?? "Failed to load playlists.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [user?._id]);

    const handleCreate = useCallback(async ({ name, description }) => {
        try {
            const res = await createPlaylist({ name, description });
            // Prepend new playlist — backend returns raw playlist without videos array
            setPlaylists((prev) => [{ ...res.data, videos: [] }, ...prev]);
            toast.success("Playlist created!");
        } catch (err) {
            toast.error(err?.response?.data?.message ?? "Failed to create playlist.");
        }
    }, []);

    return { playlists, loading, error, handleCreate };
}

export default usePlaylistsPage;
