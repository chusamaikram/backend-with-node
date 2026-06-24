import { useState } from "react";
import { Plus } from "lucide-react";
import Container from "@/layouts/Container";
import PlaylistCard from "./PlaylistCard";
import NewPlaylistModal from "./NewPlaylistModal";
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";
import { PlaylistCardSkeleton } from "@/components/skeletons";
import usePlaylistsPage from "@/hooks/usePlaylistsPage";
import useDebounce from "@/hooks/useDebounce";

function PlaylistsPage() {
    const { playlists, loading, error, handleCreate } = usePlaylistsPage();
    const [showModal, setShowModal] = useState(false);
    const [query, setQuery]         = useState("");
    const debouncedQuery            = useDebounce(query, 250);

    const filtered = debouncedQuery.trim()
        ? playlists.filter((pl) => pl.name.toLowerCase().includes(debouncedQuery.toLowerCase().trim()))
        : playlists;

    return (
        <Container as="section" className="py-6 space-y-5">
            <header className="flex flex-wrap items-center gap-3 justify-between">
                <h1 className="text-xl font-semibold text-text-primary">Playlists</h1>
                <div className="flex items-center gap-3">
                    {!loading && playlists.length > 0 && (
                        <SearchInput
                            value={query}
                            onChange={setQuery}
                            placeholder="Search playlists…"
                            className="w-48 sm:w-64"
                        />
                    )}
                    <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                        <Plus size={15} aria-hidden="true" />
                        New Playlist
                    </Button>
                </div>
            </header>

            {loading ? (
                <PlaylistCardSkeleton count={8} />
            ) : error ? (
                <p className="text-error text-sm">{error}</p>
            ) : playlists.length === 0 ? (
                <div className="flex flex-col items-center py-24 text-center">
                    <p className="text-5xl mb-4">📋</p>
                    <p className="text-lg font-medium text-text-primary">No playlists yet</p>
                    <p className="text-sm text-text-muted mt-1">Create your first playlist to organize your videos.</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center py-24 text-center">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="text-sm text-text-muted">No playlists match &ldquo;{debouncedQuery}&rdquo;</p>
                </div>
            ) : (
                <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map((pl) => (
                        <li key={pl._id}><PlaylistCard playlist={pl} /></li>
                    ))}
                </ul>
            )}

            {showModal && (
                <NewPlaylistModal
                    onClose={() => setShowModal(false)}
                    onCreate={handleCreate}
                />
            )}
        </Container>
    );
}

export default PlaylistsPage;
