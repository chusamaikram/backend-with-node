import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import Container from "@/layouts/Container";
import PlaylistHeader from "./PlaylistHeader";
import VideoCard from "@/components/video/VideoCard";
import Button from "@/components/ui/Button";
import { MOCK_PLAYLISTS, MOCK_VIDEOS } from "@/data/mockData";

function PlaylistDetailPage() {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const playlist = MOCK_PLAYLISTS.find((p) => p._id === playlistId) ?? MOCK_PLAYLISTS[0];
  const [videos, setVideos] = useState(MOCK_VIDEOS.slice(0, playlist.videosCount || 3));

  function removeVideo(id) {
    setVideos((p) => p.filter((v) => v._id !== id));
  }

  return (
    <Container as="section" className="py-6 space-y-6">
      <PlaylistHeader
        playlist={{ ...playlist, videosCount: videos.length }}
        onEdit={() => {}}
        onDelete={() => navigate("/playlists")}
      />

      <div className="space-y-3">
        {videos.length ? (
          <ul role="list" className="space-y-3">
            {videos.map((v, i) => (
              <li key={v._id} className="flex items-start gap-4 group">
                <span className="shrink-0 text-sm text-text-muted w-5 pt-1 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <VideoCard video={v} layout="horizontal" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVideo(v._id)}
                  aria-label="Remove from playlist"
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                >
                  <Trash2 size={14} className="text-error" aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-muted text-sm">This playlist is empty.</p>
          </div>
        )}
      </div>
    </Container>
  );
}

export default PlaylistDetailPage;
