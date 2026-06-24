import { cn } from "@/utils/cn";

const sizes = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-8 border-[3px]",
};

/**
 * Spinner — accessible loading indicator.
 */
function Spinner({ size = "md", className, label = "Loading…" }) {
  return (
    <span role="status" aria-label={label} className={cn("inline-flex", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "rounded-full border-bg-border border-t-accent animate-spin",
          sizes[size]
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default Spinner;
