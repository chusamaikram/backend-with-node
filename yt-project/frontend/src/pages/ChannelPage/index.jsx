import { useState } from "react";
import { useParams } from "react-router-dom";
import Container from "@/layouts/Container";
import ChannelHeader from "./ChannelHeader";
import ChannelTabs from "./ChannelTabs";
import { MOCK_USER, MOCK_VIDEOS, MOCK_PLAYLISTS, MOCK_TWEETS } from "@/data/mockData";
import VideoCard from "@/components/video/VideoCard";
import { formatDate } from "@/utils/formatDate";

function ChannelPage() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("Videos");

  // Use mock user; in Sprint 4 fetch by username
  const channel = { ...MOCK_USER, username: username ?? MOCK_USER.username };
  const channelVideos = MOCK_VIDEOS.filter((v) => v.owner.username === MOCK_USER.username);

  return (
    <Container as="section" className="py-6 space-y-6">
      <ChannelHeader channel={channel} />
      <ChannelTabs active={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      <div className="pt-2">
        {activeTab === "Videos" && (
          <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {channelVideos.map((v) => (
              <li key={v._id}><VideoCard video={v} /></li>
            ))}
          </ul>
        )}

        {activeTab === "Playlists" && (
          <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MOCK_PLAYLISTS.map((pl) => (
              <li key={pl._id} className="rounded-xl bg-bg-elevated p-4 space-y-2">
                <img src={pl.thumbnail.url} alt={pl.name} className="w-full aspect-video object-cover rounded-lg" />
                <p className="font-medium text-text-primary text-sm">{pl.name}</p>
                <p className="text-xs text-text-muted">{pl.videosCount} videos</p>
              </li>
            ))}
          </ul>
        )}

        {activeTab === "Tweets" && (
          <ul role="list" className="space-y-4 max-w-2xl">
            {MOCK_TWEETS.map((t) => (
              <li key={t._id} className="bg-bg-elevated rounded-xl p-4 space-y-2">
                <p className="text-sm text-text-primary leading-relaxed">{t.content}</p>
                <p className="text-xs text-text-muted">{formatDate(t.createdAt)} &middot; ❤ {t.likesCount}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}

export default ChannelPage;
