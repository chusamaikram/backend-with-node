import Container from "@/layouts/Container";
import VideoCard from "@/components/video/VideoCard";
import { MOCK_VIDEOS } from "@/data/mockData";

const liked = MOCK_VIDEOS.filter((_, i) => i % 2 === 0);

function LikedVideosPage() {
  return (
    <Container as="section" className="py-6 space-y-5">
      <header>
        <h1 className="text-xl font-semibold text-text-primary">Liked Videos</h1>
        <p className="text-sm text-text-muted mt-0.5">{liked.length} videos</p>
      </header>

      {liked.length ? (
        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {liked.map((v) => (
            <li key={v._id}><VideoCard video={v} /></li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center py-24 text-center">
          <p className="text-5xl mb-4">❤️</p>
          <p className="text-lg font-medium text-text-primary">No liked videos yet</p>
          <p className="text-sm text-text-muted mt-1">Like videos to see them here.</p>
        </div>
      )}
    </Container>
  );
}

export default LikedVideosPage;
