import Container from "@/layouts/Container";
import HistoryGroup from "./HistoryGroup";
import { MOCK_VIDEOS } from "@/data/mockData";

// Group videos into Today / This Week / Earlier (using mock dates)
const groups = [
  { label: "Today",      videos: MOCK_VIDEOS.slice(0, 2) },
  { label: "This Week",  videos: MOCK_VIDEOS.slice(2, 5) },
  { label: "Earlier",    videos: MOCK_VIDEOS.slice(5) },
];

function WatchHistoryPage() {
  return (
    <Container as="section" className="py-6 space-y-8">
      <h1 className="text-xl font-semibold text-text-primary">Watch History</h1>
      {groups.map((g) => (
        <HistoryGroup key={g.label} label={g.label} videos={g.videos} />
      ))}
    </Container>
  );
}

export default WatchHistoryPage;
