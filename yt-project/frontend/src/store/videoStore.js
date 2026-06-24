import { create } from "zustand";

/**
 * videoStore — caches fetched videos and tracks pagination + filter state.
 *
 * Why Zustand and not local useState?
 *   If we stored videos in a component's local state, navigating away from
 *   HomePage and coming back would destroy that state and trigger a fresh
 *   network request. Zustand keeps it alive for the session.
 *
 * Shape:
 *   videos      → accumulated list across all fetched pages
 *   page        → next page number to fetch (starts at 1)
 *   hasNextPage → false when API says there are no more pages
 *   loading     → true while a fetch is in flight
 *   error       → error message string or null
 *   filters     → active sort/search params (sortBy, sortType, query)
 */
const useVideoStore = create((set) => ({
    videos: [],
    page: 1,
    hasNextPage: true,
    loading: false,
    error: null,
    filters: {
        sortBy: "createdAt",
        sortType: "desc",
        query: "",
    },

    // ── Actions ───────────────────────────────────────────────────────────

    /**
     * Append a new page of videos to the existing list.
     * Called after every successful API response.
     */
    appendVideos: (newVideos) =>
        set((state) => ({
            videos: [...state.videos, ...newVideos],
        })),

    /**
     * Advance the page counter after a successful fetch.
     */
    incrementPage: () =>
        set((state) => ({ page: state.page + 1 })),

    setHasNextPage: (value) => set({ hasNextPage: value }),

    setLoading: (value) => set({ loading: value }),

    setError: (message) => set({ error: message }),

    /**
     * Update active filters.
     * Partial update — only pass the fields you want to change.
     * Always call reset() after setFilters() to clear stale video data.
     */
    setFilters: (partial) =>
        set((state) => ({
            filters: { ...state.filters, ...partial },
        })),

    /**
     * Reset the video list and pagination back to initial state.
     * Must be called whenever filters change so the new filter
     * starts fetching from page 1 with a clean list.
     */
    reset: () =>
        set({
            videos: [],
            page: 1,
            hasNextPage: true,
            error: null,
        }),
}));

export default useVideoStore;
