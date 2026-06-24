import { cn } from "@/utils/cn";

const variants = {
  default: "bg-black/75 text-text-primary",
  accent:  "bg-accent text-white",
  success: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning",
  error:   "bg-error/20 text-error",
};

/**
 * Badge — small inline label.
 * Used for video duration overlays, status chips, etc.
 */
function Badge({ variant = "default", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono font-medium leading-none",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
