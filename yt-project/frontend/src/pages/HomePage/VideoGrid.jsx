import VideoCard from "@/components/video/VideoCard";

/**
 * VideoGrid — responsive grid of VideoCards.
 * 1 col → 2 col → 3 col → 4 col.
 */
function VideoGrid({ videos }) {
  if (!videos?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-5xl mb-4">📺</p>
        <p className="text-lg font-medium text-text-primary">Nothing here yet</p>
        <p className="text-sm text-text-muted mt-1">Check back later for new videos.</p>
      </div>
    );
  }

  return (
    <ul
      role="list"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 content-enter"
    >
      {videos.map((video) => (
        <li key={video._id}>
          <VideoCard video={video} layout="grid" />
        </li>
      ))}
    </ul>
  );
}

export default VideoGrid;
