import Container from "@/layouts/Container";
import VideoCard from "@/components/video/VideoCard";
import { VideoCardSkeleton } from "@/components/skeletons";
import useLikedVideos from "@/hooks/useLikedVideos";

function LikedVideosPage() {
    const { videos, loading, error } = useLikedVideos();

    return (
        <Container as="section" className="py-6 space-y-5">
            <header>
                <h1 className="text-xl font-semibold text-text-primary">Liked Videos</h1>
                {!loading && !error && (
                    <p className="text-sm text-text-muted mt-0.5">{videos.length} videos</p>
                )}
            </header>

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
            ) : videos.length === 0 ? (
                <div className="flex flex-col items-center py-24 text-center">
                    <p className="text-5xl mb-4">❤️</p>
                    <p className="text-lg font-medium text-text-primary">No liked videos yet</p>
                    <p className="text-sm text-text-muted mt-1">Like videos to see them here.</p>
                </div>
            ) : (
                <ul role="list" className="space-y-3">
                    {videos.map((v) => (
                        <li key={v._id}>
                            <VideoCard video={v} layout="horizontal" />
                        </li>
                    ))}
                </ul>
            )}
        </Container>
    );
}

export default LikedVideosPage;
