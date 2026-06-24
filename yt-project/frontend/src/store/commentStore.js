import { create } from "zustand";

/**
 * commentStore — caches comments for the currently viewed video.
 *
 * Optimistic updates for all mutations:
 *   - addComment    → prepend a temporary comment, replace with real one on success
 *   - deleteComment → remove immediately, restore on failure
 *   - updateComment → update content immediately, revert on failure
 *   - toggleLike    → toggle isLiked + likesCount immediately, revert on failure
 */
const useCommentStore = create((set) => ({
    comments: [],
    page: 1,
    hasNextPage: true,
    loading: false,
    error: null,
    totalComments: 0,

    // ── Actions ───────────────────────────────────────────────────────────

    setComments: (comments) => set({ comments }),

    appendComments: (newComments) =>
        set((state) => ({
            comments: [...state.comments, ...newComments],
        })),

    setTotalComments: (total) => set({ totalComments: total }),
    setHasNextPage: (value) => set({ hasNextPage: value }),
    incrementPage: () => set((state) => ({ page: state.page + 1 })),
    setLoading: (value) => set({ loading: value }),
    setError: (message) => set({ error: message }),

    // Prepend a new comment optimistically (before API responds)
    prependComment: (comment) =>
        set((state) => ({
            comments: [comment, ...state.comments],
            totalComments: state.totalComments + 1,
        })),

    // Replace a temporary comment with the real one from API
    replaceComment: (tempId, realComment) =>
        set((state) => ({
            comments: state.comments.map((c) =>
                c._id === tempId ? realComment : c
            ),
        })),

    // Remove a comment optimistically
    removeComment: (commentId) =>
        set((state) => ({
            comments: state.comments.filter((c) => c._id !== commentId),
            totalComments: Math.max(0, state.totalComments - 1),
        })),

    // Restore a removed comment on API failure
    restoreComment: (comment, index) =>
        set((state) => {
            const updated = [...state.comments];
            updated.splice(index, 0, comment);
            return {
                comments: updated,
                totalComments: state.totalComments + 1,
            };
        }),

    // Update comment content optimistically
    updateCommentContent: (commentId, content) =>
        set((state) => ({
            comments: state.comments.map((c) =>
                c._id === commentId ? { ...c, content } : c
            ),
        })),

    // Toggle like on a single comment optimistically
    toggleCommentLike: (commentId) =>
        set((state) => ({
            comments: state.comments.map((c) =>
                c._id === commentId
                    ? {
                          ...c,
                          isLiked: !c.isLiked,
                          likesCount: c.isLiked
                              ? c.likesCount - 1
                              : c.likesCount + 1,
                      }
                    : c
            ),
        })),

    reset: () =>
        set({
            comments: [],
            page: 1,
            hasNextPage: true,
            loading: false,
            error: null,
            totalComments: 0,
        }),
}));

export default useCommentStore;
