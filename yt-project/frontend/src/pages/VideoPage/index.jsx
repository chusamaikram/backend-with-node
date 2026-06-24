import { useParams } from "react-router-dom";
import Container from "@/layouts/Container";
import VideoPlayer from "./VideoPlayer";
import VideoInfo from "./VideoInfo";
import CommentSection from "./CommentSection";
import RelatedVideos from "./RelatedVideos";
import { MOCK_VIDEOS } from "@/data/mockData";

function VideoPage() {
  const { videoId } = useParams();
  const video = MOCK_VIDEOS.find((v) => v._id === videoId) ?? MOCK_VIDEOS[0];

  return (
    <Container as="section" className="py-6">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Left: player + info + comments ── */}
        <div className="flex-1 min-w-0 space-y-6">
          <VideoPlayer video={video} />
          <VideoInfo video={video} />
          <CommentSection />
        </div>

        {/* ── Right: related videos ──────────── */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0">
          <RelatedVideos currentId={video._id} />
        </div>

      </div>
    </Container>
  );
}

export default VideoPage;
