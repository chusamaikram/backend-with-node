import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "@/layouts/Container";
import SearchFilters from "./SearchFilters";
import SearchResults from "./SearchResults";
import { MOCK_VIDEOS } from "@/data/mockData";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [sort, setSort] = useState("relevance");

  const results = useMemo(() => {
    const filtered = query
      ? MOCK_VIDEOS.filter((v) =>
          v.title.toLowerCase().includes(query.toLowerCase()) ||
          v.description.toLowerCase().includes(query.toLowerCase())
        )
      : MOCK_VIDEOS;

    return [...filtered].sort((a, b) => {
      if (sort === "views")     return b.views - a.views;
      if (sort === "createdAt") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
  }, [query, sort]);

  return (
    <Container as="section" className="py-6 space-y-5">
      <header>
        <h1 className="text-xl font-semibold text-text-primary">
          {query ? (
            <>Results for <span className="text-accent">&ldquo;{query}&rdquo;</span></>
          ) : (
            "All Videos"
          )}
        </h1>
        <p className="text-sm text-text-muted mt-0.5">{results.length} results</p>
      </header>

      <SearchFilters sort={sort} onSort={setSort} />
      <SearchResults videos={results} query={query} />
    </Container>
  );
}

export default SearchPage;
