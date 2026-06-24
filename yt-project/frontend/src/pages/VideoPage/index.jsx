import { useParams } from "react-router-dom";
import Container from "@/layouts/Container";
import VideoPlayer from "./VideoPlayer";
import VideoInfo from "./VideoInfo";
import CommentSection from "./CommentSection";
import RelatedVideos from "./RelatedVideos";
import Skeleton from "@/components/skeletons/Skeleton";
import useVideoDetail from "@/hooks/useVideoDetail";

function VideoPage() {
    const { videoId } = useParams();
    const {
        video,
        loading,
        error,
        isLiked,
        likesCount,
        isSubscribed,
        subscribersCount,
        handleLike,
        handleSubscribe,
        isLoggedIn,
    } = useVideoDetail(videoId);

    // ── Loading state — skeleton layout matching the real page ────────────
    if (loading) {
        return (
            <Container as="section" className="py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 min-w-0 space-y-4">
                        <Skeleton className="w-full aspect-video rounded-xl" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/3" />
                        <div className="flex items-center gap-3 py-3 border-y border-bg-border">
                            <Skeleton className="size-10 rounded-full" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            <Skeleton className="h-9 w-24 rounded-lg" />
                        </div>
                        <Skeleton className="h-24 rounded-xl" />
                    </div>
                    <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-3">
                        {Array.from({ length: 6 }, (_, i) => (
                            <div key={i} className="flex gap-3">
                                <Skeleton className="w-40 aspect-video rounded-xl shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-3.5 w-full" />
                                    <Skeleton className="h-3 w-2/3" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        );
    }

    // ── Error state ───────────────────────────────────────────────────────
    if (error || !video) {
        return (
            <Container className="py-24 text-center">
                <p className="text-5xl mb-4">😕</p>
                <p className="text-lg font-medium text-text-primary">Video not found</p>
                <p className="text-sm text-text-muted mt-1">
                    {error ?? "This video may have been removed."}
                </p>
            </Container>
        );
    }

    return (
        <Container as="section" className="py-6">
            <div className="flex flex-col lg:flex-row gap-6">

                {/* ── Left: player + info + comments ── */}
                <div className="flex-1 min-w-0 space-y-6">
                    <VideoPlayer video={video} />
                    <VideoInfo
                        video={video}
                        isLiked={isLiked}
                        likesCount={likesCount}
                        isSubscribed={isSubscribed}
                        subscribersCount={subscribersCount}
                        onLike={handleLike}
                        onSubscribe={handleSubscribe}
                        isLoggedIn={isLoggedIn}
                    />
                    <CommentSection videoId={videoId} isLoggedIn={isLoggedIn} />
                </div>

                {/* ── Right: related videos ── */}
                <div className="w-full lg:w-80 xl:w-96 shrink-0">
                    <RelatedVideos currentVideoId={videoId} />
                </div>

            </div>
        </Container>
    );
}

export default VideoPage;
