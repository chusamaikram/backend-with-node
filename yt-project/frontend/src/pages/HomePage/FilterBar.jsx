import { cn } from "@/utils/cn";

const FILTERS = [
  { label: "Newest",     value: "createdAt" },
  { label: "Most Viewed", value: "views" },
  { label: "Most Liked", value: "likes" },
];

/**
 * FilterBar — pill buttons to sort the home video grid.
 */
function FilterBar({ active, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap" role="toolbar" aria-label="Sort videos">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          aria-pressed={active === f.value}
          className={cn(
            "h-8 px-4 rounded-full text-sm font-medium transition-colors duration-150",
            active === f.value
              ? "bg-accent text-white"
              : "bg-bg-elevated text-text-secondary hover:bg-bg-border hover:text-text-primary"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
