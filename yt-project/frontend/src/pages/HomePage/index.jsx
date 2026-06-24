import { useState, useMemo } from "react";
import Container from "@/layouts/Container";
import FilterBar from "./FilterBar";
import VideoGrid from "./VideoGrid";
import { MOCK_VIDEOS } from "@/data/mockData";

/**
 * HomePage — video grid with sort filter.
 */
function HomePage() {
  const [sortBy, setSortBy] = useState("createdAt");

  const sorted = useMemo(() => {
    return [...MOCK_VIDEOS].sort((a, b) => {
      if (sortBy === "views")     return b.views - a.views;
      if (sortBy === "likes")     return b.likesCount - a.likesCount;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [sortBy]);

  return (
    <Container as="section" className="py-6 space-y-5">
      <FilterBar active={sortBy} onChange={setSortBy} />
      <VideoGrid videos={sorted} />
    </Container>
  );
}

export default HomePage;
