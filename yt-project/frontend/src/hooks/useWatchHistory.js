import { useState, useEffect } from "react";
import { getWatchHistory } from "@/api/services/user.service";

function getGroup(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffDays = Math.floor((now.setHours(0,0,0,0) - date.setHours(0,0,0,0)) / 86_400_000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return "This Week";
    return "Earlier";
}

const GROUP_ORDER = ["Today", "Yesterday", "This Week", "Earlier"];

function useWatchHistory() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getWatchHistory();
                const videos = res.data ?? [];

                // Group videos by date label
                const map = {};
                videos.forEach((v) => {
                    const label = getGroup(v.createdAt);
                    if (!map[label]) map[label] = [];
                    map[label].push(v);
                });

                // Sort groups in defined order, skip empty ones
                setGroups(GROUP_ORDER.filter((g) => map[g]).map((g) => ({ label: g, videos: map[g] })));
            } catch (err) {
                setError(err?.response?.data?.message ?? "Failed to load watch history.");
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    return { groups, loading, error };
}

export default useWatchHistory;
