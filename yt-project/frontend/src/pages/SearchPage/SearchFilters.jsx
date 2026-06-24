import { cn } from "@/utils/cn";

const SORT_OPTIONS = [
  { label: "Relevance",    value: "relevance" },
  { label: "Upload Date",  value: "createdAt" },
  { label: "View Count",   value: "views" },
];

function SearchFilters({ sort, onSort }) {
  return (
    <div className="flex items-center gap-2 flex-wrap" role="toolbar" aria-label="Filter results">
      <span className="text-sm text-text-muted mr-1">Sort:</span>
      {SORT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSort(opt.value)}
          aria-pressed={sort === opt.value}
          className={cn(
            "h-8 px-3 rounded-full text-sm transition-colors duration-150",
            sort === opt.value
              ? "bg-accent text-white"
              : "bg-bg-elevated text-text-secondary hover:bg-bg-border hover:text-text-primary"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default SearchFilters;
