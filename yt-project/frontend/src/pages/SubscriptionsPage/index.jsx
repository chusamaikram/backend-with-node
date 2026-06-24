import Container from "@/layouts/Container";
import ChannelCard from "./ChannelCard";
import VideoCard from "@/components/video/VideoCard";
import { MOCK_CHANNELS, MOCK_VIDEOS } from "@/data/mockData";

function SubscriptionsPage() {
  return (
    <Container as="section" className="py-6 space-y-8">
      {/* Subscribed Channels */}
      <section>
        <h1 className="text-xl font-semibold text-text-primary mb-4">Subscribed Channels</h1>
        <ul role="list" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {MOCK_CHANNELS.map((ch) => (
            <li key={ch._id}><ChannelCard channel={ch} /></li>
          ))}
        </ul>
      </section>

      {/* Latest videos */}
      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Latest from Subscriptions</h2>
        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {MOCK_VIDEOS.slice(0, 8).map((v) => (
            <li key={v._id}><VideoCard video={v} /></li>
          ))}
        </ul>
      </section>
    </Container>
  );
}

export default SubscriptionsPage;
