import VideoCard from "@/components/video/VideoCard";
import { MOCK_VIDEOS } from "@/data/mockData";

/**
 * RelatedVideos — sidebar list of up-next videos.
 */
function RelatedVideos({ currentId }) {
  const videos = MOCK_VIDEOS.filter((v) => v._id !== currentId).slice(0, 6);

  return (
    <aside aria-label="Related videos">
      <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">
        Up Next
      </h2>
      <ul role="list" className="space-y-3">
        {videos.map((video) => (
          <li key={video._id}>
            <VideoCard video={video} layout="horizontal" />
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default RelatedVideos;
