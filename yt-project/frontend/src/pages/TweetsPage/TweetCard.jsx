import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Pencil, Trash2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { formatDate } from "@/utils/formatDate";
import useAuthStore from "@/store/authStore";

function TweetCard({ tweet, onEdit, onDelete, onLike }) {
    const { user } = useAuthStore();
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(tweet.content);

    const owner = tweet.ownerDetails;
    const isOwner = user?._id === owner?._id;

    function saveEdit() {
        if (!editText.trim() || editText.trim() === tweet.content) {
            setEditing(false);
            return;
        }
        onEdit(tweet._id, editText.trim(), tweet.content);
        setEditing(false);
    }

    function cancelEdit() {
        setEditText(tweet.content);
        setEditing(false);
    }

    return (
        <article className="bg-bg-elevated rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
                <Link to={`/channel/${owner?.username}`}>
                    <Avatar
                        src={owner?.avatar}
                        alt={owner?.fullname}
                        fallback={owner?.username?.[0]}
                        size="sm"
                        className="shrink-0 mt-0.5"
                    />
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                        <Link to={`/channel/${owner?.username}`} className="text-sm font-semibold text-text-primary hover:text-accent transition-colors">{owner?.fullname}</Link>
                        <span className="text-xs text-text-muted">@{owner?.username}</span>
                        <span className="text-xs text-text-muted ml-auto shrink-0">{formatDate(tweet.createdAt)}</span>
                    </div>

                    {editing ? (
                        <div className="mt-2 space-y-2">
                            <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 text-sm rounded-lg bg-bg-base border border-bg-border
                                           text-text-primary resize-none focus:outline-none focus:border-accent transition-colors"
                            />
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                                <Button size="sm" variant="primary" onClick={saveEdit}>Save</Button>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">{tweet.content}</p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-1 border-t border-bg-border">
                <button
                    onClick={() => onLike(tweet._id)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${tweet.isLiked ? "text-accent" : "text-text-muted hover:text-accent"}`}
                    aria-label={tweet.isLiked ? "Unlike" : "Like"}
                >
                    <Heart size={15} fill={tweet.isLiked ? "currentColor" : "none"} aria-hidden="true" />
                    {tweet.likesCount > 0 && <span className="text-xs">{tweet.likesCount}</span>}
                </button>

                {isOwner && !editing && (
                    <>
                        <button
                            onClick={() => setEditing(true)}
                            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors ml-auto"
                            aria-label="Edit tweet"
                        >
                            <Pencil size={14} aria-hidden="true" /> Edit
                        </button>
                        <button
                            onClick={() => onDelete(tweet._id)}
                            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-error transition-colors"
                            aria-label="Delete tweet"
                        >
                            <Trash2 size={14} aria-hidden="true" /> Delete
                        </button>
                    </>
                )}
            </div>
        </article>
    );
}

export default TweetCard;
