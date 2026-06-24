import { useState } from "react";
import { ThumbsUp, Pencil, Trash2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { MOCK_COMMENTS, MOCK_USER } from "@/data/mockData";
import { formatDate } from "@/utils/formatDate";

/**
 * CommentSection — comment list with add / edit / delete / like.
 */
function CommentSection() {
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [newText, setNewText]   = useState("");
  const [editId, setEditId]     = useState(null);
  const [editText, setEditText] = useState("");

  function handleAdd(e) {
    e.preventDefault();
    if (!newText.trim()) return;
    setComments([
      {
        _id: `c-${Date.now()}`,
        content: newText.trim(),
        createdAt: new Date().toISOString(),
        owner: MOCK_USER,
        likesCount: 0,
        isLiked: false,
      },
      ...comments,
    ]);
    setNewText("");
  }

  function handleDelete(id) {
    setComments(comments.filter((c) => c._id !== id));
  }

  function startEdit(c) {
    setEditId(c._id);
    setEditText(c.content);
  }

  function handleEditSave(id) {
    if (!editText.trim()) return;
    setComments(comments.map((c) => c._id === id ? { ...c, content: editText.trim() } : c));
    setEditId(null);
  }

  function toggleLike(id) {
    setComments(comments.map((c) =>
      c._id === id
        ? { ...c, isLiked: !c.isLiked, likesCount: c.likesCount + (c.isLiked ? -1 : 1) }
        : c
    ));
  }

  return (
    <section aria-label="Comments" className="space-y-5">
      <h2 className="text-base font-semibold text-text-primary">
        {comments.length} Comments
      </h2>

      {/* Add comment */}
      <form onSubmit={handleAdd} className="flex gap-3">
        <Avatar
          src={MOCK_USER.avatar}
          alt={MOCK_USER.fullname}
          fallback={MOCK_USER.username[0]}
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
              <Button type="button" variant="ghost" size="sm" onClick={() => setNewText("")}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">Comment</Button>
            </div>
          )}
        </div>
      </form>

      {/* Comment list */}
      <ul role="list" className="space-y-5">
        {comments.map((comment) => (
          <li key={comment._id} className="flex gap-3">
            <Avatar
              src={comment.owner.avatar}
              alt={comment.owner.fullname}
              fallback={comment.owner.username[0]}
              size="sm"
              className="shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-text-primary">
                  {comment.owner.fullname}
                </span>
                <span className="text-xs text-text-muted">{formatDate(comment.createdAt)}</span>
              </div>

              {editId === comment._id ? (
                <div className="mt-1 space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-bg-elevated border border-bg-border
                               text-text-primary resize-none focus:outline-none focus:border-accent transition-colors"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>Cancel</Button>
                    <Button size="sm" variant="primary" onClick={() => handleEditSave(comment._id)}>Save</Button>
                  </div>
                </div>
              ) : (
                <p className="mt-0.5 text-sm text-text-secondary leading-relaxed">
                  {comment.content}
                </p>
              )}

              {/* Actions */}
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => toggleLike(comment._id)}
                  className={`flex items-center gap-1 text-xs transition-colors ${comment.isLiked ? "text-accent" : "text-text-muted hover:text-text-secondary"}`}
                  aria-label={comment.isLiked ? "Unlike comment" : "Like comment"}
                >
                  <ThumbsUp size={13} aria-hidden="true" />
                  {comment.likesCount > 0 && comment.likesCount}
                </button>

                {comment.owner._id === MOCK_USER._id && (
                  <>
                    <button
                      onClick={() => startEdit(comment)}
                      className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors"
                      aria-label="Edit comment"
                    >
                      <Pencil size={13} aria-hidden="true" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment._id)}
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
        ))}
      </ul>
    </section>
  );
}

export default CommentSection;
