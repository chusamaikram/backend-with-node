import { useState, useEffect, useCallback } from "react";
import { getChannelStats, getChannelVideos } from "@/api/services/dashboard.service";
import { togglePublishStatus, deleteVideo } from "@/api/services/video.service";
import toast from "react-hot-toast";

function useDashboard() {
    const [stats, setStats]           = useState(null);
    const [videos, setVideos]         = useState([]);
    const [statsLoading, setStatsLoading] = useState(true);
    const [videosLoading, setVideosLoading] = useState(true);
    const [error, setError]           = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getChannelStats();
                setStats(res.data);
            } catch {
                setError("Failed to load stats.");
            } finally {
                setStatsLoading(false);
            }
        };

        const fetchVideos = async () => {
            try {
                const res = await getChannelVideos();
                setVideos(res.data ?? []);
            } catch {
                setError("Failed to load videos.");
            } finally {
                setVideosLoading(false);
            }
        };

        fetchStats();
        fetchVideos();
    }, []);

    // ── Toggle publish ─────────────────────────────────────────────────────
    const handleTogglePublish = useCallback(async (videoId) => {
        setVideos((prev) =>
            prev.map((v) => v._id === videoId ? { ...v, isPublished: !v.isPublished } : v)
        );
        try {
            await togglePublishStatus(videoId);
        } catch (err) {
            setVideos((prev) =>
                prev.map((v) => v._id === videoId ? { ...v, isPublished: !v.isPublished } : v)
            );
            toast.error(err?.response?.data?.message ?? "Failed to update publish status.");
        }
    }, []);

    // ── Delete video ───────────────────────────────────────────────────────
    const handleDelete = useCallback(async (videoId) => {
        const index = videos.findIndex((v) => v._id === videoId);
        const video = videos[index];
        setVideos((prev) => prev.filter((v) => v._id !== videoId)); // optimistic
        try {
            await deleteVideo(videoId);
            toast.success("Video deleted.");
        } catch {
            setVideos((prev) => {  // revert
                const copy = [...prev];
                copy.splice(index, 0, video);
                return copy;
            });
            toast.error("Failed to delete video.");
        }
    }, [videos]);

    return { stats, videos, statsLoading, videosLoading, error, handleTogglePublish, handleDelete };
}

export default useDashboard;
