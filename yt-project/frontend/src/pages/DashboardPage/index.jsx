import { Link } from "react-router-dom";
import { Video, Eye, ThumbsUp, Users, Plus } from "lucide-react";
import Container from "@/layouts/Container";
import StatCard from "./StatCard";
import VideoTable from "./VideoTable";
import { MOCK_VIDEOS, MOCK_DASHBOARD_STATS } from "@/data/mockData";
import { formatViews } from "@/utils/formatViews";

const STATS = [
  { label: "Total Videos",    value: MOCK_DASHBOARD_STATS.totalVideos,                            icon: Video,    color: "text-accent"   },
  { label: "Total Views",     value: formatViews(MOCK_DASHBOARD_STATS.totalViews).replace(" views",""), icon: Eye,      color: "text-blue-400" },
  { label: "Total Likes",     value: formatViews(MOCK_DASHBOARD_STATS.totalLikes).replace(" views",""), icon: ThumbsUp, color: "text-success"  },
  { label: "Subscribers",     value: MOCK_DASHBOARD_STATS.totalSubscribers.toLocaleString(),      icon: Users,    color: "text-warning"  },
];

function DashboardPage() {
  const myVideos = MOCK_VIDEOS.filter((v) => v.owner.username === "johndoe");

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Videos table */}
      <section>
        <h2 className="text-base font-semibold text-text-primary mb-4">Your Videos</h2>
        {myVideos.length ? (
          <VideoTable videos={myVideos} />
        ) : (
          <div className="text-center py-16 rounded-xl bg-bg-elevated">
            <p className="text-text-muted">No videos yet. Upload your first one!</p>
          </div>
        )}
      </section>
    </Container>
  );
}

export default DashboardPage;
