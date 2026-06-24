import { useCallback, useEffect } from "react";
import useVideoStore from "@/store/videoStore";
import { getAllVideos } from "@/api/services/video.service";

/**
 * useVideos — drives all video-fetching flows (HomePage + SearchPage).
 *
 * What it does:
 *   1. On mount (or when filters change), fetches the first page automatically.
 *   2. Exposes `fetchMore` for the infinite scroll observer to call.
 *   3. Reads/writes everything through videoStore so data is cached
 *      across navigation — going back to HomePage doesn't re-fetch.
 *
 * Why useCallback for fetchMore?
 *   fetchMore is passed down to the IntersectionObserver. Without useCallback,
 *   a new function reference would be created on every render, causing the
 *   observer to re-attach on every render — a subtle but real performance bug.
 *
 * Why useEffect for the initial fetch?
 *   We want to fetch automatically when the hook first mounts or when filters
 *   change. useEffect with [filters] as dependency handles both cases cleanly.
 *
 * @param {{ sortBy?: string, sortType?: string, query?: string, userId?: string }} overrideFilters
 *   Optional — SearchPage passes { query } here. HomePage passes nothing.
 */
function useVideos(overrideFilters = {}) {
    const {
        videos,
        page,
        hasNextPage,
        loading,
        error,
        filters,
        appendVideos,
        incrementPage,
        setHasNextPage,
        setLoading,
        setError,
        setFilters,
        reset,
    } = useVideoStore();

    // Merge store filters with any overrides from the caller
    const activeFilters = { ...filters, ...overrideFilters };

    // ── Core fetch function ───────────────────────────────────────────────
    // useCallback so the reference is stable across renders.
    // Dependencies: page and activeFilters — we need the latest values of both.
    const fetchVideos = useCallback(async (pageToFetch) => {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const res = await getAllVideos({
                page: pageToFetch,
                limit: 12,
                sortBy: activeFilters.sortBy,
                sortType: activeFilters.sortType,
                query: activeFilters.query || undefined,
                userId: activeFilters.userId || undefined,
            });

            // Backend response shape:
            // { statusCode, data: { docs, totalDocs, page, totalPages, hasNextPage }, message }
            const { docs, hasNextPage: more } = res.data;

            appendVideos(docs);
            setHasNextPage(more);
            incrementPage();
        } catch (err) {
            // 404 from backend means "no videos found" — treat as empty, not error
            if (err?.response?.status === 404) {
                setHasNextPage(false);
            } else {
                setError(err?.response?.data?.message ?? "Failed to load videos.");
            }
        } finally {
            setLoading(false);
        }
    }, [activeFilters.sortBy, activeFilters.sortType, activeFilters.query, activeFilters.userId]);

    // ── Initial fetch — runs on mount and whenever filters change ─────────
    // When filters change: reset() clears the list + resets page to 1,
    // then this effect fires and fetches page 1 with the new filters.
    useEffect(() => {
        reset();
        fetchVideos(1);
    }, [activeFilters.sortBy, activeFilters.sortType, activeFilters.query, activeFilters.userId]);

    // ── fetchMore — called by IntersectionObserver when sentinel is visible ─
    // Guard: don't fetch if already loading or no more pages exist.
    const fetchMore = useCallback(() => {
        if (!loading && hasNextPage) {
            fetchVideos(page);
        }
    }, [loading, hasNextPage, page, fetchVideos]);

    return {
        videos,
        loading,
        error,
        hasNextPage,
        fetchMore,
        setFilters,
        filters,
    };
}

export default useVideos;
