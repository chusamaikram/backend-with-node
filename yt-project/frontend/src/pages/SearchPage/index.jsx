import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "@/layouts/Container";
import SearchFilters from "./SearchFilters";
import SearchResults from "./SearchResults";
import { VideoGridSkeleton } from "@/components/skeletons";
import Spinner from "@/components/ui/Spinner";
import useVideos from "@/hooks/useVideos";
import useDebounce from "@/hooks/useDebounce";

/**
 * SearchPage — real search results from GET /videos?query=&sortBy=&sortType=
 *
 * Key decisions:
 *
 * 1. Query comes from the URL (?q=) — not local state.
 *    This makes search results shareable/bookmarkable.
 *    The Navbar already pushes to /search?q=... on submit.
 *
 * 2. We debounce the query before passing it to useVideos.
 *    If a user lands on /search?q=react, q is already final so debounce
 *    fires immediately. If they type in the search bar and the URL
 *    updates live, debounce prevents hammering the API on each keystroke.
 *
 * 3. Sort is stored in the URL (?sort=views) not in local state.
 *    Why? So the URL stays shareable — /search?q=react&sort=views
 *    is a meaningful link. We read it with useSearchParams.
 *
 * 4. useVideos receives overrideFilters — the hook merges these with
 *    the store's base filters. When query or sort changes, useVideos
 *    resets the list and re-fetches from page 1 automatically.
 */
function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const rawQuery = searchParams.get("q") ?? "";
    const sort     = searchParams.get("sort") ?? "createdAt";

    // Debounce the query — wait 300ms after it stops changing before fetching
    const debouncedQuery = useDebounce(rawQuery, 300);

    const { videos, loading, error, hasNextPage, fetchMore } = useVideos({
        query:    debouncedQuery,
        sortBy:   sort === "relevance" ? "createdAt" : sort,
        sortType: "desc",
    });

    const sentinelRef = useRef(null);

    // ── Infinite scroll observer ──────────────────────────────────────────
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) fetchMore();
            },
            { threshold: 0.1 }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [fetchMore]);

    // ── Sort change — write back to URL ───────────────────────────────────
    // We update the URL param instead of local state so the URL stays
    // shareable. useVideos re-fetches automatically because its
    // overrideFilters dependency changes.
    function handleSortChange(value) {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("sort", value);
            return next;
        });
    }

    // ── Render states ─────────────────────────────────────────────────────
    const isFirstLoad = loading && videos.length === 0;

    return (
        <Container as="section" className="py-6 space-y-5">

            {/* Header */}
            <header>
                <h1 className="text-xl font-semibold text-text-primary">
                    {rawQuery ? (
                        <>Results for <span className="text-accent">&ldquo;{rawQuery}&rdquo;</span></>
                    ) : (
                        "All Videos"
                    )}
                </h1>
                {!isFirstLoad && (
                    <p className="text-sm text-text-muted mt-0.5">
                        {videos.length} result{videos.length !== 1 ? "s" : ""}
                    </p>
                )}
            </header>

            <SearchFilters sort={sort} onSort={handleSortChange} />

            {isFirstLoad ? (
                // Show skeleton in horizontal layout to match SearchResults cards
                <ul role="list" className="flex flex-col gap-4">
                    {Array.from({ length: 6 }, (_, i) => (
                        <li key={i}>
                            <div className="flex gap-3 animate-pulse">
                                <div className="w-48 aspect-video rounded-xl bg-bg-elevated shrink-0" />
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-4 bg-bg-elevated rounded w-3/4" />
                                    <div className="h-3 bg-bg-elevated rounded w-1/3" />
                                    <div className="h-3 bg-bg-elevated rounded w-1/2" />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : error ? (
                <SearchResults videos={[]} query={rawQuery} />
            ) : (
                <>
                    <SearchResults videos={videos} query={rawQuery} />

                    {/* Sentinel for infinite scroll */}
                    <div ref={sentinelRef} className="h-4" aria-hidden="true" />

                    {loading && (
                        <div className="flex justify-center py-4">
                            <Spinner size="md" label="Loading more results…" />
                        </div>
                    )}

                    {!hasNextPage && videos.length > 0 && (
                        <p className="text-center text-sm text-text-muted py-4">
                            No more results.
                        </p>
                    )}
                </>
            )}
        </Container>
    );
}

export default SearchPage;
