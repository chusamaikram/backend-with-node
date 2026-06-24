import Container from "@/layouts/Container";
import HistoryGroup from "./HistoryGroup";
import { VideoCardSkeleton } from "@/components/skeletons";
import useWatchHistory from "@/hooks/useWatchHistory";

function WatchHistoryPage() {
    const { groups, loading, error } = useWatchHistory();

    return (
        <Container as="section" className="py-6 space-y-8">
            <h1 className="text-xl font-semibold text-text-primary">Watch History</h1>

            {loading ? (
                <ul className="space-y-3">
                    {Array.from({ length: 6 }, (_, i) => (
                        <li key={i}>
                            <VideoCardSkeleton layout="horizontal" />
                        </li>
                    ))}
                </ul>
            ) : error ? (
                <p className="text-error text-sm">{error}</p>
            ) : groups.length === 0 ? (
                <div className="flex flex-col items-center py-24 text-center">
                    <p className="text-5xl mb-4">🕐</p>
                    <p className="text-lg font-medium text-text-primary">No watch history yet</p>
                    <p className="text-sm text-text-muted mt-1">Videos you watch will appear here.</p>
                </div>
            ) : (
                groups.map((g) => (
                    <HistoryGroup key={g.label} label={g.label} videos={g.videos} />
                ))
            )}
        </Container>
    );
}

export default WatchHistoryPage;
