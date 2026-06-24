import VideoCard from "@/components/video/VideoCard";

function SearchResults({ videos, query }) {
  if (!videos.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-lg font-medium text-text-primary">No results for &ldquo;{query}&rdquo;</p>
        <p className="text-sm text-text-muted mt-1">Try different keywords.</p>
      </div>
    );
  }

  return (
    <ul role="list" className="flex flex-col gap-4">
      {videos.map((video) => (
        <li key={video._id}>
          <VideoCard video={video} layout="horizontal" />
        </li>
      ))}
    </ul>
  );
}

export default SearchResults;
