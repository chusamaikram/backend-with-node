import { useEffect, useCallback } from "react";
import useVideoDetailStore from "@/store/videoDetailStore";
import useAuthStore from "@/store/authStore";
import { useAuthStatus } from "@/providers/AuthProvider";
import { getVideoById } from "@/api/services/video.service";
import { toggleVideoLike } from "@/api/services/like.service";
import { toggleSubscription } from "@/api/services/subscription.service";

/**
 * useVideoDetail — fetches a single video and handles like/subscribe mutations.
 *
 * Optimistic update flow for like/subscribe:
 *   1. Update store immediately → UI reflects change instantly
 *   2. Fire API in background
 *   3. On error → revert store to previous state + show nothing
 *      (we don't toast on revert — silent revert is better UX)
 *
 * Why useCallback for handleLike and handleSubscribe?
 *   These are passed as props to child components (VideoInfo).
 *   Without useCallback, a new function reference is created every render,
 *   causing unnecessary re-renders of child components.
 *
 * @param {string} videoId
 */
function useVideoDetail(videoId) {
    const { isLoggedIn } = useAuthStore();
    const { authChecked } = useAuthStatus();

    const {
        video,
        loading,
        error,
        isLiked,
        likesCount,
        isSubscribed,
        subscribersCount,
        setVideo,
        setLoading,
        setError,
        toggleLike,
        revertLike,
        toggleSubscribe,
        revertSubscribe,
        reset,
    } = useVideoDetailStore();

    // ── Fetch video on mount / videoId change ─────────────────────────────
    // Wait for AuthProvider to finish before fetching.
    // This ensures accessToken is in memory before the request fires,
    // so optionalVerifyJWT on the backend receives the Authorization header
    // and can correctly compute isSubscribed / isLiked for logged-in users.
    useEffect(() => {
        if (!videoId || !authChecked) return;
        reset();

        const fetchVideo = async () => {
            setLoading(true);
            try {
                // sessionStorage tracks which videos were viewed this browser session.
                // On refresh, sessionStorage persists — so the view is not re-counted.
                // sessionStorage clears when the tab is closed — a new tab = new view.
                const sessionKey = `viewed_${videoId}`;
                const alreadyViewed = sessionStorage.getItem(sessionKey);

                const res = await getVideoById(videoId, !alreadyViewed);
                if (!alreadyViewed) {
                    sessionStorage.setItem(sessionKey, "1");
                }
                setVideo(res.data);
            } catch (err) {
                setError(err?.response?.data?.message ?? "Failed to load video.");
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
        return () => reset();
    }, [videoId, authChecked]);

    // ── Like toggle with optimistic update ────────────────────────────────
    const handleLike = useCallback(async () => {
        if (!isLoggedIn) return;

        toggleLike(); // optimistic

        try {
            await toggleVideoLike(videoId);
            // Backend returns { isLiked } but we already updated optimistically
            // so we don't need to sync — both states should match
        } catch {
            revertLike(); // silent revert on failure
        }
    }, [videoId, isLoggedIn, toggleLike, revertLike]);

    // ── Subscribe toggle with optimistic update ───────────────────────────
    const handleSubscribe = useCallback(async () => {
        if (!isLoggedIn || !video?.owner?._id) return;

        toggleSubscribe(); // optimistic

        try {
            await toggleSubscription(video.owner._id);
        } catch {
            revertSubscribe(); // silent revert on failure
        }
    }, [video?.owner?._id, isLoggedIn, toggleSubscribe, revertSubscribe]);

    return {
        video,
        loading,
        error,
        isLiked,
        likesCount,
        isSubscribed,
        subscribersCount,
        handleLike,
        handleSubscribe,
        isLoggedIn,
    };
}

export default useVideoDetail;
