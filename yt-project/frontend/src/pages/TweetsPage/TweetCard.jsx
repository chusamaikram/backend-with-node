import { useState } from "react";
import { Heart, Pencil, Trash2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { formatDate } from "@/utils/formatDate";
import { MOCK_USER } from "@/data/mockData";

function TweetCard({ tweet, onEdit, onDelete }) {
  const [liked, setLiked] = useState(tweet.isLiked);
  const [count, setCount] = useState(tweet.likesCount);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(tweet.content);

  function toggleLike() {
    setLiked((p) => !p);
    setCount((p) => p + (liked ? -1 : 1));
  }

  function saveEdit() {
    if (!editText.trim()) return;
    onEdit(tweet._id, editText.trim());
    setEditing(false);
  }

  const isOwner = tweet.owner._id === MOCK_USER._id;

  return (
    <article className="bg-bg-elevated rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Avatar
          src={tweet.owner.avatar}
          alt={tweet.owner.fullname}
          fallback={tweet.owner.username[0]}
          size="sm"
          className="shrink-0 mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-text-primary">{tweet.owner.fullname}</span>
            <span className="text-xs text-text-muted">@{tweet.owner.username}</span>
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
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
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
          onClick={toggleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? "text-accent" : "text-text-muted hover:text-accent"}`}
          aria-label={liked ? "Unlike" : "Like"}
        >
          <Heart size={15} fill={liked ? "currentColor" : "none"} aria-hidden="true" />
          {count > 0 && <span className="text-xs">{count}</span>}
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
