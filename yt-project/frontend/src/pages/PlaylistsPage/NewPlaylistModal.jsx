import { useState } from "react";
import { X } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

function NewPlaylistModal({ onClose, onCreate }) {
    const [name, setName]       = useState("");
    const [desc, setDesc]       = useState("");
    const [error, setError]     = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim()) { setError("Playlist name is required."); return; }
        setLoading(true);
        await onCreate({ name: name.trim(), description: desc.trim() });
        setLoading(false);
        onClose();
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-md bg-bg-surface border border-bg-border rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <h2 id="modal-title" className="text-lg font-semibold text-text-primary">
                        New Playlist
                    </h2>
                    <button onClick={onClose} aria-label="Close" className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors">
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Name"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(""); }}
                        error={error}
                        placeholder="My Playlist"
                    />
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-text-secondary">Description</label>
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            placeholder="Optional description…"
                            rows={3}
                            className="w-full px-3 py-2 text-sm rounded-md bg-bg-elevated border border-bg-border
                                       text-text-primary placeholder:text-text-muted resize-none
                                       focus:outline-none focus:border-accent transition-colors"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                        <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={loading}>Cancel</Button>
                        <Button type="submit" variant="primary" size="sm" disabled={loading}>
                            {loading ? "Creating…" : "Create"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewPlaylistModal;
