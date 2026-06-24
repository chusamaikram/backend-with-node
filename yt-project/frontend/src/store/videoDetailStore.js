import { create } from "zustand";

/**
 * videoDetailStore — caches a single video's full data including
 * real-time like and subscribe state for optimistic updates.
 *
 * Why separate from videoStore?
 *   videoStore handles the paginated list (HomePage/SearchPage).
 *   This store handles one specific video's detail view — different
 *   shape, different lifecycle, different reset requirements.
 *
 * Optimistic update pattern:
 *   When user clicks Like/Subscribe:
 *     1. Update the store immediately (instant UI feedback)
 *     2. Fire the API call in the background
 *     3. If API fails → revert store to previous state
 *   This makes the UI feel instant with zero perceived latency.
 */
const useVideoDetailStore = create((set) => ({
    video: null,
    loading: false,
    error: null,

    // ── Like state ────────────────────────────────────────────────────────
    isLiked: false,
    likesCount: 0,

    // ── Subscribe state ───────────────────────────────────────────────────
    isSubscribed: false,
    subscribersCount: 0,

    // ── Actions ───────────────────────────────────────────────────────────

    setVideo: (video) =>
        set({
            video,
            // Backend sends these inside video.owner for getVideoById
            isSubscribed: video?.owner?.isSubscribed ?? false,
            subscribersCount: video?.owner?.subscribersCount ?? 0,
            // likesCount comes from the video object itself
            // isLiked will be set separately once we have a likes endpoint
            likesCount: video?.likesCount ?? 0,
            isLiked: video?.isLiked ?? false,
        }),

    setLoading: (value) => set({ loading: value }),
    setError: (message) => set({ error: message }),

    // Optimistic like toggle — call this before the API call
    toggleLike: () =>
        set((state) => ({
            isLiked: !state.isLiked,
            likesCount: state.isLiked
                ? state.likesCount - 1
                : state.likesCount + 1,
        })),

    // Revert like — call this if the API call fails
    revertLike: () =>
        set((state) => ({
            isLiked: !state.isLiked,
            likesCount: state.isLiked
                ? state.likesCount - 1
                : state.likesCount + 1,
        })),

    // Optimistic subscribe toggle
    toggleSubscribe: () =>
        set((state) => ({
            isSubscribed: !state.isSubscribed,
            subscribersCount: state.isSubscribed
                ? state.subscribersCount - 1
                : state.subscribersCount + 1,
        })),

    // Revert subscribe — call this if the API call fails
    revertSubscribe: () =>
        set((state) => ({
            isSubscribed: !state.isSubscribed,
            subscribersCount: state.isSubscribed
                ? state.subscribersCount - 1
                : state.subscribersCount + 1,
        })),

    reset: () =>
        set({
            video: null,
            loading: false,
            error: null,
            isLiked: false,
            likesCount: 0,
            isSubscribed: false,
            subscribersCount: 0,
        }),

    // Partial update after edit
    updateVideo: (partial) =>
        set((state) => ({
            video: state.video ? { ...state.video, ...partial } : null,
        })),
}));

export default useVideoDetailStore;
