import { useEffect, useCallback } from "react";
import useTweetStore from "@/store/tweetStore";
import useAuthStore from "@/store/authStore";
import { getAllTweets, createTweet, updateTweet, deleteTweet } from "@/api/services/tweet.service";
import { toggleTweetLike } from "@/api/services/like.service";
import toast from "react-hot-toast";

function useTweets() {
    const { user } = useAuthStore();
    const {
        tweets, loading, error, hasNextPage, page,
        setTweets, setLoading, setError,
        prependTweet, updateTweet: updateInStore, revertTweet,
        removeTweet, insertTweet, toggleLike, reset,
    } = useTweetStore();

    // ── Fetch ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await getAllTweets({ page: 1, limit: 10 });
                const { docs, hasNextPage: hnp, page: p } = res.data;
                setTweets(docs ?? [], hnp, p);
            } catch (err) {
                setError(err?.response?.data?.message ?? "Failed to load tweets.");
            } finally {
                setLoading(false);
            }
        };
        fetch();
        return () => reset();
    }, []);

    // ── Create ────────────────────────────────────────────────────────────
    const handleCreate = useCallback(async (content) => {
        // Optimistic — build a temp tweet using the logged-in user
        const temp = {
            _id: `temp-${Date.now()}`,
            content,
            createdAt: new Date().toISOString(),
            likesCount: 0,
            isLiked: false,
            ownerDetails: {
                _id: user._id,
                username: user.username,
                fullname: user.fullname,
                avatar: user.avatar,
            },
        };
        prependTweet(temp);

        try {
            const res = await createTweet({ content });
            // Replace temp with real tweet from API, keep ownerDetails attached
            updateInStore(temp._id, res.data.content);
            // Swap temp _id for real _id by re-fetching just page 1
            const refreshed = await getAllTweets({ page: 1, limit: 10 });
            const { docs, hasNextPage: hnp, page: p } = refreshed.data;
            setTweets(docs ?? [], hnp, p);
        } catch {
            removeTweet(temp._id);
            toast.error("Failed to post tweet.");
        }
    }, [user, prependTweet, updateInStore, removeTweet, setTweets]);

    // ── Edit ──────────────────────────────────────────────────────────────
    const handleEdit = useCallback(async (tweetId, content, originalContent) => {
        updateInStore(tweetId, content); // optimistic
        try {
            await updateTweet(tweetId, { content });
        } catch {
            revertTweet(tweetId, originalContent); // revert
            toast.error("Failed to update tweet.");
        }
    }, [updateInStore, revertTweet]);

    // ── Delete ────────────────────────────────────────────────────────────
    const handleDelete = useCallback(async (tweetId) => {
        const index = tweets.findIndex((t) => t._id === tweetId);
        const tweet = tweets[index];
        removeTweet(tweetId); // optimistic
        try {
            await deleteTweet(tweetId);
        } catch {
            insertTweet(tweet, index); // revert
            toast.error("Failed to delete tweet.");
        }
    }, [tweets, removeTweet, insertTweet]);

    // ── Like ──────────────────────────────────────────────────────────────
    const handleLike = useCallback(async (tweetId) => {
        toggleLike(tweetId); // optimistic
        try {
            await toggleTweetLike(tweetId);
        } catch {
            toggleLike(tweetId); // revert
            toast.error("Failed to update like.");
        }
    }, [toggleLike]);

    return { tweets, loading, error, hasNextPage, handleCreate, handleEdit, handleDelete, handleLike };
}

export default useTweets;
