import { useEffect, useCallback } from "react";
import useCommentStore from "@/store/commentStore";
import useAuthStore from "@/store/authStore";
import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
} from "@/api/services/comment.service";
import { toggleCommentLike } from "@/api/services/like.service";

/**
 * useComments — manages all comment operations for a video.
 *
 * Optimistic patterns:
 *   ADD    → prepend a temp comment with a fake _id, replace with real one from API
 *   DELETE → remove immediately, restore at original index if API fails
 *   EDIT   → update content immediately, revert to old content if API fails
 *   LIKE   → toggle isLiked + likesCount immediately, revert if API fails
 *
 * Why temp IDs for add?
 *   We prepend the comment before the API responds. We need a unique key
 *   for React's list rendering. We use `temp-${Date.now()}` as a placeholder,
 *   then swap it with the real _id once the API responds.
 *
 * @param {string} videoId
 */
function useComments(videoId) {
    const { user } = useAuthStore();

    const {
        comments,
        page,
        hasNextPage,
        loading,
        error,
        totalComments,
        appendComments,
        setTotalComments,
        setHasNextPage,
        incrementPage,
        setLoading,
        setError,
        prependComment,
        replaceComment,
        removeComment,
        restoreComment,
        updateCommentContent,
        toggleCommentLike: toggleLikeInStore,
        reset,
    } = useCommentStore();

    // ── Initial fetch ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!videoId) return;
        reset();
        fetchComments(1);

        return () => reset();
    }, [videoId]);

    // ── Core fetch function ───────────────────────────────────────────────
    const fetchComments = useCallback(async (pageToFetch) => {
        setLoading(true);
        try {
            const res = await getVideoComments(videoId, {
                page: pageToFetch,
                limit: 10,
            });
            const { docs, hasNextPage: more, totalDocs } = res.data;
            appendComments(docs);
            setHasNextPage(more);
            setTotalComments(totalDocs);
            incrementPage();
        } catch {
            setError("Failed to load comments.");
        } finally {
            setLoading(false);
        }
    }, [videoId]);

    // ── Load more (called by "Load more" button) ──────────────────────────
    const loadMore = useCallback(() => {
        if (!loading && hasNextPage) fetchComments(page);
    }, [loading, hasNextPage, page, fetchComments]);

    // ── Add comment ───────────────────────────────────────────────────────
    const handleAdd = useCallback(async (content) => {
        if (!content?.trim() || !user) return;

        const tempId = `temp-${Date.now()}`;
        const tempComment = {
            _id: tempId,
            content: content.trim(),
            createdAt: new Date().toISOString(),
            owner: {
                _id: user._id,
                username: user.username,
                fullname: user.fullname,
                avatar: user.avatar,
            },
            likesCount: 0,
            isLiked: false,
        };

        prependComment(tempComment); // optimistic

        try {
            const res = await addComment(videoId, { content: content.trim() });
            // Replace temp comment with real one, but preserve owner data
            // since addComment response doesn't include populated owner
            replaceComment(tempId, {
                ...res.data,
                owner: tempComment.owner,
                likesCount: 0,
                isLiked: false,
            });
        } catch {
            // Remove the temp comment if API fails
            removeComment(tempId);
            setError("Failed to add comment.");
        }
    }, [videoId, user]);

    // ── Delete comment ────────────────────────────────────────────────────
    const handleDelete = useCallback(async (commentId) => {
        const index = comments.findIndex((c) => c._id === commentId);
        const comment = comments[index];

        removeComment(commentId); // optimistic

        try {
            await deleteComment(commentId);
        } catch {
            restoreComment(comment, index); // revert
            setError("Failed to delete comment.");
        }
    }, [comments]);

    // ── Edit comment ──────────────────────────────────────────────────────
    const handleEdit = useCallback(async (commentId, newContent) => {
        if (!newContent?.trim()) return;

        const original = comments.find((c) => c._id === commentId);
        updateCommentContent(commentId, newContent.trim()); // optimistic

        try {
            await updateComment(commentId, { content: newContent.trim() });
        } catch {
            updateCommentContent(commentId, original.content); // revert
            setError("Failed to update comment.");
        }
    }, [comments]);

    // ── Like comment ──────────────────────────────────────────────────────
    const handleLikeComment = useCallback(async (commentId) => {
        toggleLikeInStore(commentId); // optimistic

        try {
            await toggleCommentLike(commentId);
        } catch {
            toggleLikeInStore(commentId); // revert (toggle back)
        }
    }, []);

    return {
        comments,
        loading,
        error,
        hasNextPage,
        totalComments,
        loadMore,
        handleAdd,
        handleDelete,
        handleEdit,
        handleLikeComment,
        currentUserId: user?._id,
    };
}

export default useComments;
