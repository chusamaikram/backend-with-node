import { useState } from "react";
import { Plus } from "lucide-react";
import Container from "@/layouts/Container";
import PlaylistCard from "./PlaylistCard";
import NewPlaylistModal from "./NewPlaylistModal";
import Button from "@/components/ui/Button";
import { MOCK_PLAYLISTS } from "@/data/mockData";

function PlaylistsPage() {
  const [playlists, setPlaylists] = useState(MOCK_PLAYLISTS);
  const [showModal, setShowModal] = useState(false);

  function handleCreate({ name, description }) {
    setPlaylists([
      {
        _id: `pl-${Date.now()}`,
        name,
        description,
        videosCount: 0,
        thumbnail: { url: "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=400&q=80" },
        createdAt: new Date().toISOString(),
      },
      ...playlists,
    ]);
  }

  return (
    <Container as="section" className="py-6 space-y-5">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Playlists</h1>
        <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
          <Plus size={15} aria-hidden="true" />
          New Playlist
        </Button>
      </header>

      {playlists.length ? (
        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {playlists.map((pl) => (
            <li key={pl._id}><PlaylistCard playlist={pl} /></li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center py-24 text-center">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-lg font-medium text-text-primary">No playlists yet</p>
          <p className="text-sm text-text-muted mt-1">Create your first playlist to organize your videos.</p>
        </div>
      )}

      {showModal && <NewPlaylistModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
    </Container>
  );
}

export default PlaylistsPage;
