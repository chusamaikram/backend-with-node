import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Trash2, Eye, EyeOff } from "lucide-react";
import Badge from "@/components/ui/Badge";

function formatDateParts({ year, month, day } = {}) {
    if (!year) return "—";
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
    });
}

function ActionMenu({ video, onToggle, onDeleteConfirm }) {
    const [open, setOpen] = useState(false);
    const [pos, setPos]   = useState({ top: 0, left: 0 });
    const btnRef          = useRef(null);
    const menuRef         = useRef(null);

    function handleOpen() {
        const rect = btnRef.current.getBoundingClientRect();
        setPos({ top: rect.bottom + window.scrollY + 4, left: rect.right + window.scrollX - 176 });
        setOpen((p) => !p);
    }

    // Close on outside click — ignore clicks inside the menu itself
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (
                !btnRef.current?.contains(e.target) &&
                !menuRef.current?.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    return (
        <>
            <button
                ref={btnRef}
                onClick={handleOpen}
                aria-label="Video actions"
                className="p-1.5 rounded-md text-text-muted hover:bg-bg-border hover:text-text-primary transition-colors"
            >
                <MoreVertical size={16} aria-hidden="true" />
            </button>

            {open && (
                <div
                    ref={menuRef}
                    style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 9999 }}
                    className="w-44 bg-bg-surface border border-bg-border rounded-xl shadow-xl py-1"
                >
                    <button
                        onClick={() => { onToggle(video._id); setOpen(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                    >
                        {video.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                        {video.isPublished ? "Set as Draft" : "Publish"}
                    </button>
                    <button
                        onClick={() => { onDeleteConfirm(video._id); setOpen(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                    >
                        <Trash2 size={14} aria-hidden="true" /> Delete
                    </button>
                </div>
            )}
        </>
    );
}

function VideoTable({ videos, onTogglePublish, onDelete }) {
    const [confirmId, setConfirmId] = useState(null);

    return (
        <>
            {/* Confirm delete dialog */}
            {confirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-bg-surface border border-bg-border rounded-2xl p-6 space-y-4 w-full max-w-sm text-center">
                        <p className="text-lg font-semibold text-text-primary">Delete video?</p>
                        <p className="text-sm text-text-muted">This action cannot be undone.</p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setConfirmId(null)}
                                className="px-4 py-2 text-sm rounded-lg bg-bg-elevated text-text-secondary hover:text-text-primary transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { onDelete(confirmId); setConfirmId(null); }}
                                className="px-4 py-2 text-sm rounded-lg bg-error text-white hover:bg-error/80 transition-colors"
                            >
                                Yes, delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-border-subtle">
                <table className="w-full text-sm min-w-[600px]">
                    <thead className="bg-bg-overlay">
                        <tr>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Video</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Likes</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 w-10" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                        {videos.map((v) => (
                            <tr key={v._id} className="hover:bg-bg-elevated/50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={v.thumbnail?.url}
                                            alt=""
                                            className="w-20 aspect-video object-cover rounded-lg shrink-0 bg-bg-border"
                                        />
                                        <Link
                                            to={`/watch/${v._id}`}
                                            className="text-text-primary hover:text-accent transition-colors font-medium line-clamp-2"
                                        >
                                            {v.title}
                                        </Link>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-text-secondary">
                                    {v.likesCount?.toLocaleString() ?? 0}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant={v.isPublished ? "success" : "warning"}>
                                        {v.isPublished ? "Published" : "Draft"}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                                    {formatDateParts(v.createdAt)}
                                </td>
                                <td className="px-4 py-3">
                                    <ActionMenu
                                        video={v}
                                        onToggle={onTogglePublish}
                                        onDeleteConfirm={setConfirmId}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default VideoTable;
