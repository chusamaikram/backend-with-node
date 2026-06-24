import { useState } from "react";
import { X } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { updateVideo } from "@/api/services/video.service";
import toast from "react-hot-toast";

function EditVideoModal({ video, onClose, onSave }) {
    const [title, setTitle]           = useState(video.title ?? "");
    const [description, setDescription] = useState(video.description ?? "");
    const [thumbnail, setThumbnail]   = useState(null);
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim()) { setError("Title is required."); return; }

        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        if (thumbnail) formData.append("thumbnail", thumbnail);

        setLoading(true);
        try {
            const res = await updateVideo(video._id, formData);
            toast.success("Video updated.");
            onSave(res.data);
            onClose();
        } catch (err) {
            toast.error(err?.response?.data?.message ?? "Failed to update video.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-video-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-md bg-bg-surface border border-bg-border rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <h2 id="edit-video-title" className="text-lg font-semibold text-text-primary">
                        Edit Video
                    </h2>
                    <button onClick={onClose} aria-label="Close" className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors">
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Title"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value); setError(""); }}
                        error={error}
                        placeholder="Video title"
                    />
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-text-secondary">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Video description"
                            className="w-full px-3 py-2 text-sm rounded-md bg-bg-elevated border border-bg-border
                                       text-text-primary placeholder:text-text-muted resize-none
                                       focus:outline-none focus:border-accent transition-colors"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-text-secondary">
                            Thumbnail <span className="text-text-muted font-normal">(optional — leave blank to keep current)</span>
                        </label>
                        {thumbnail ? (
                            <div className="flex items-center gap-3">
                                <img src={URL.createObjectURL(thumbnail)} alt="" className="h-16 aspect-video object-cover rounded-lg" />
                                <button type="button" onClick={() => setThumbnail(null)} className="text-xs text-error hover:underline">Remove</button>
                            </div>
                        ) : (
                            <label className="flex items-center justify-center h-16 rounded-lg border-2 border-dashed border-bg-border hover:border-accent transition-colors cursor-pointer">
                                <span className="text-sm text-text-muted">Click to upload new thumbnail</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={(e) => e.target.files?.[0] && setThumbnail(e.target.files[0])}
                                />
                            </label>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                        <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={loading}>Cancel</Button>
                        <Button type="submit" variant="primary" size="sm" disabled={loading}>
                            {loading ? "Saving…" : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditVideoModal;
