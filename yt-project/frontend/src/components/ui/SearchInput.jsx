import { useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/utils/cn";

function SearchInput({ value, onChange, placeholder = "Search…", className }) {
  const ref = useRef(null);

  return (
    <div className={cn("relative", className)}>
      <Search
        size={14}
        aria-hidden="true"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
      />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full h-9 pl-8 pr-8 text-sm rounded-lg
                   bg-bg-elevated border border-bg-border
                   text-text-primary placeholder:text-text-muted
                   focus:outline-none focus:border-accent
                   transition-colors duration-150"
      />
      {value && (
        <button
          type="button"
          onClick={() => { onChange(""); ref.current?.focus(); }}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={13} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
