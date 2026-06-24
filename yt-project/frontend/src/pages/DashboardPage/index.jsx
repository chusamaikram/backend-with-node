import { useState } from "react";
import { Link } from "react-router-dom";
import { Video, Eye, ThumbsUp, Users, Plus } from "lucide-react";
import Container from "@/layouts/Container";
import StatCard from "./StatCard";
import VideoTable from "./VideoTable";
import { StatCardSkeleton, VideoTableSkeleton } from "@/components/skeletons";
import SearchInput from "@/components/ui/SearchInput";
import { formatViews } from "@/utils/formatViews";
import useDashboard from "@/hooks/useDashboard";
import useDebounce from "@/hooks/useDebounce";

function DashboardPage() {
    const { stats, videos, statsLoading, videosLoading, error, handleTogglePublish, handleDelete } =
        useDashboard();
    const [query, setQuery] = useState("");
    const debouncedQuery    = useDebounce(query, 250);

    const filtered = debouncedQuery.trim()
        ? videos.filter((v) => v.title.toLowerCase().includes(debouncedQuery.toLowerCase().trim()))
        : videos;

    const statCards = stats ? [
        { label: "Total Videos",   value: stats.totalVideos,                                          icon: Video,    color: "text-accent"   },
        { label: "Total Views",    value: formatViews(stats.totalViews).replace(" views", ""),         icon: Eye,      color: "text-blue-400" },
        { label: "Total Likes",    value: formatViews(stats.totalLikes).replace(" views", ""),         icon: ThumbsUp, color: "text-success"  },
        { label: "Subscribers",    value: stats.totalSubscribers.toLocaleString(),                     icon: Users,    color: "text-warning"  },
    ] : [];

    return (
        <Container as="section" className="py-6 space-y-8">
            <header className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-text-primary">Channel Dashboard</h1>
                <Link
                    to="/upload"
                    className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium rounded-md
                               bg-accent text-white hover:bg-accent-hover transition-colors"
                >
                    <Plus size={15} aria-hidden="true" /> Upload Video
                </Link>
            </header>

            {/* Stats */}
            {statsLoading ? (
                <StatCardSkeleton count={4} />
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((s) => (
                        <StatCard key={s.label} {...s} />
                    ))}
                </div>
            )}

            {/* Videos table */}
            <section>
                <div className="flex items-center justify-between gap-4 mb-4">
                    <h2 className="text-base font-semibold text-text-primary shrink-0">Your Videos</h2>
                    {!videosLoading && videos.length > 0 && (
                        <SearchInput
                            value={query}
                            onChange={setQuery}
                            placeholder="Search your videos…"
                            className="w-full max-w-xs"
                        />
                    )}
                </div>

                {videosLoading ? (
                    <VideoTableSkeleton />
                ) : error ? (
                    <p className="text-error text-sm">{error}</p>
                ) : videos.length === 0 ? (
                    <div className="text-center py-16 rounded-xl bg-bg-elevated">
                        <p className="text-4xl mb-3">🎬</p>
                        <p className="text-text-muted text-sm">No videos yet.</p>
                        <Link to="/upload" className="text-accent text-sm hover:underline mt-1 inline-block">
                            Upload your first video
                        </Link>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 rounded-xl bg-bg-elevated">
                        <p className="text-3xl mb-3">🔍</p>
                        <p className="text-text-muted text-sm">No videos match &ldquo;{debouncedQuery}&rdquo;</p>
                    </div>
                ) : (
                    <VideoTable
                        videos={filtered}
                        onTogglePublish={handleTogglePublish}
                        onDelete={handleDelete}
                    />
                )}
            </section>
        </Container>
    );
}

export default DashboardPage;
