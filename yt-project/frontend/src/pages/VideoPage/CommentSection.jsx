import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, Pencil, Trash2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { CommentSkeleton } from "@/components/skeletons";
import { formatDate } from "@/utils/formatDate";
import useComments from "@/hooks/useComments";
import useAuthStore from "@/store/authStore";

/**
 * CommentSection — full comment CRUD wired to real API via useComments.
 *
 * Guests can see comments but cannot add/edit/delete/like.
 * All mutations use optimistic updates — UI updates instantly.
 */
function CommentSection({ videoId, isLoggedIn }) {
    const { user } = useAuthStore();
    const {
        comments,
        loading,
        hasNextPage,
        totalComments,
        loadMore,
        handleAdd,
        handleDelete,
        handleEdit,
        handleLikeComment,
        currentUserId,
    } = useComments(videoId);

    const [newText, setNewText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // ── Add comment submit ────────────────────────────────────────────────
    async function handleSubmit(e) {
        e.preventDefault();
        if (!newText.trim() || submitting) return;
        setSubmitting(true);
        await handleAdd(newText);
        setNewText("");
        setSubmitting(false);
    }

    return (
        <section aria-label="Comments" className="space-y-5">

            <h2 className="text-base font-semibold text-text-primary">
                {totalComments > 0 ? `${totalComments} Comments` : "Comments"}
            </h2>

            {/* Add comment — only for logged in users */}
            {isLoggedIn ? (
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <Avatar
                        src={user?.avatar}
                        alt={user?.fullname}
                        fallback={user?.username?.[0] ?? "U"}
                        size="sm"
                        className="shrink-0 mt-1"
                    />
                    <div className="flex-1 space-y-2">
                        <textarea
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            placeholder="Add a comment…"
                            rows={2}
                            className="w-full px-3 py-2 text-sm rounded-lg bg-bg-elevated border border-bg-border
                                       text-text-primary placeholder:text-text-muted resize-none
                                       focus:outline-none focus:border-accent transition-colors"
                            aria-label="Write a comment"
                        />
                        {newText.trim() && (
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setNewText("")}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    loading={submitting}
                                >
                                    Comment
                                </Button>
                            </div>
                        )}
                    </div>
                </form>
            ) : (
                <p className="text-sm text-text-muted">
                    <Link to="/login" className="text-accent hover:underline">Sign in</Link>
                    {" "}to leave a comment.
                </p>
            )}

            {/* Comment list */}
            {loading && comments.length === 0 ? (
                <CommentSkeleton count={5} />
            ) : (
                <>
                    <ul role="list" className="space-y-5">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment._id}
                                comment={comment}
                                currentUserId={currentUserId}
                                isLoggedIn={isLoggedIn}
                                onLike={handleLikeComment}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </ul>

                    {/* Load more */}
                    {hasNextPage && (
                        <div className="flex justify-center pt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={loadMore}
                                loading={loading}
                            >
                                Load more comments
                            </Button>
                        </div>
                    )}

                    {comments.length === 0 && !loading && (
                        <p className="text-sm text-text-muted text-center py-8">
                            No comments yet. Be the first to comment.
                        </p>
                    )}
                </>
            )}
        </section>
    );
}

/* ── Single comment item ─────────────────────────────────────────────── */
function CommentItem({ comment, currentUserId, isLoggedIn, onLike, onEdit, onDelete }) {
    const [editMode, setEditMode] = useState(false);
    const [editText, setEditText] = useState(comment.content);
    const isOwner = currentUserId && comment.owner?._id === currentUserId;

    // useCallback so this doesn't recreate on every render
    const handleSave = useCallback(async () => {
        if (!editText.trim()) return;
        await onEdit(comment._id, editText);
        setEditMode(false);
    }, [comment._id, editText, onEdit]);

    return (
        <li className="flex gap-3">
            <Avatar
                src={comment.owner?.avatar?.url ?? comment.owner?.avatar}
                alt={comment.owner?.fullname}
                fallback={comment.owner?.username?.[0] ?? "?"}
                size="sm"
                className="shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
                {/* Name + date */}
                <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-text-primary">
                        {comment.owner?.fullname}
                    </span>
                    <span className="text-xs text-text-muted">
                        {formatDate(comment.createdAt)}
                    </span>
                </div>

                {/* Content or edit textarea */}
                {editMode ? (
                    <div className="mt-1 space-y-2">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 text-sm rounded-lg bg-bg-elevated border border-bg-border
                                       text-text-primary resize-none focus:outline-none focus:border-accent transition-colors"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => { setEditMode(false); setEditText(comment.content); }}
                            >
                                Cancel
                            </Button>
                            <Button size="sm" variant="primary" onClick={handleSave}>
                                Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="mt-0.5 text-sm text-text-secondary leading-relaxed">
                        {comment.content}
                    </p>
                )}

                {/* Actions */}
                <div className="mt-2 flex items-center gap-3">
                    {/* Like — only for logged in users */}
                    {isLoggedIn && (
                        <button
                            onClick={() => onLike(comment._id)}
                            className={`flex items-center gap-1 text-xs transition-colors ${
                                comment.isLiked
                                    ? "text-accent"
                                    : "text-text-muted hover:text-text-secondary"
                            }`}
                            aria-label={comment.isLiked ? "Unlike comment" : "Like comment"}
                        >
                            <ThumbsUp size={13} aria-hidden="true" />
                            {comment.likesCount > 0 && comment.likesCount}
                        </button>
                    )}

                    {/* Edit / Delete — only for comment owner */}
                    {isOwner && !editMode && (
                        <>
                            <button
                                onClick={() => setEditMode(true)}
                                className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors"
                                aria-label="Edit comment"
                            >
                                <Pencil size={13} aria-hidden="true" /> Edit
                            </button>
                            <button
                                onClick={() => onDelete(comment._id)}
                                className="flex items-center gap-1 text-xs text-text-muted hover:text-error transition-colors"
                                aria-label="Delete comment"
                            >
                                <Trash2 size={13} aria-hidden="true" /> Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </li>
    );
}

export default CommentSection;
