import { useState, useEffect } from "react";
import { getLikedVideos } from "@/api/services/like.service";

function useLikedVideos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getLikedVideos();
                // API returns [{ videoDetails: { ...video, ownerDetails: {...} } }]
                // Normalize to flat video shape that VideoCard expects
                const normalized = (res.data ?? []).map((item) => ({
                    ...item.videoDetails,
                    owner: item.videoDetails.ownerDetails,
                }));
                setVideos(normalized);
            } catch (err) {
                setError(err?.response?.data?.message ?? "Failed to load liked videos.");
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    return { videos, loading, error };
}

export default useLikedVideos;
