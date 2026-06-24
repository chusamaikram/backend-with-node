import { useEffect, useRef } from "react";
import Container from "@/layouts/Container";
import FilterBar from "./FilterBar";
import VideoGrid from "./VideoGrid";
import { VideoGridSkeleton } from "@/components/skeletons";
import Spinner from "@/components/ui/Spinner";
import useVideos from "@/hooks/useVideos";

/**
 * HomePage — real video feed with sort filter and infinite scroll.
 *
 * How infinite scroll works here:
 *   1. A tiny invisible `sentinelRef` div sits below the video grid.
 *   2. An IntersectionObserver watches it.
 *   3. When the sentinel enters the viewport (user scrolled to bottom),
 *      the observer fires → calls fetchMore() → fetches next page.
 *   4. New videos are appended to the store → grid grows.
 *   5. When hasNextPage is false, we disconnect the observer.
 *
 * Why useRef for the sentinel?
 *   We need a stable DOM reference across renders without triggering
 *   re-renders when the ref value changes. useRef is perfect for this.
 */
function HomePage() {
    const { videos, loading, error, hasNextPage, fetchMore, setFilters, filters } = useVideos();
    const sentinelRef = useRef(null);

    // ── Infinite scroll observer ──────────────────────────────────────────
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // entries[0].isIntersecting is true when sentinel is visible
                if (entries[0].isIntersecting) {
                    fetchMore();
                }
            },
            { threshold: 0.1 } // fire when 10% of sentinel is visible
        );

        observer.observe(sentinel);

        // Cleanup: disconnect observer when component unmounts or fetchMore changes
        return () => observer.disconnect();
    }, [fetchMore]);

    // ── Filter change handler ─────────────────────────────────────────────
    // setFilters updates the store, which triggers useEffect in useVideos
    // to reset and re-fetch from page 1 with the new sort applied.
    function handleFilterChange(sortBy) {
        setFilters({ sortBy, sortType: "desc" });
    }

    // ── Render ────────────────────────────────────────────────────────────
    // First load: videos is empty and loading is true → show skeleton grid
    const isFirstLoad = loading && videos.length === 0;

    return (
        <Container as="section" className="py-6 space-y-5">
            <FilterBar active={filters.sortBy} onChange={handleFilterChange} />

            {isFirstLoad ? (
                <VideoGridSkeleton count={12} />
            ) : error ? (
                <EmptyState message={error} />
            ) : videos.length === 0 ? (
                <EmptyState message="Nothing here yet. Check back later." />
            ) : (
                <>
                    <VideoGrid videos={videos} />

                    {/* Sentinel — IntersectionObserver target */}
                    <div ref={sentinelRef} className="h-4" aria-hidden="true" />

                    {/* Loading spinner for subsequent page fetches */}
                    {loading && (
                        <div className="flex justify-center py-4">
                            <Spinner size="md" label="Loading more videos…" />
                        </div>
                    )}

                    {/* End of feed message */}
                    {!hasNextPage && videos.length > 0 && (
                        <p className="text-center text-sm text-text-muted py-4">
                            You&apos;ve reached the end.
                        </p>
                    )}
                </>
            )}
        </Container>
    );
}

/* ── Empty / Error state ──────────────────────────────────────────────── */
function EmptyState({ message }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-5xl mb-4">📺</p>
            <p className="text-lg font-medium text-text-primary">Nothing here yet</p>
            <p className="text-sm text-text-muted mt-1">{message}</p>
        </div>
    );
}

export default HomePage;
