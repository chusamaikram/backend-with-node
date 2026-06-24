import { cn } from "@/utils/cn";

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
  "select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary:   "bg-accent text-white hover:bg-accent-hover rounded-md",
  secondary: "bg-bg-elevated text-text-primary border border-bg-border hover:bg-bg-border rounded-md",
  ghost:     "bg-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary rounded-md",
  danger:    "bg-error/20 text-error hover:bg-error/30 rounded-md",
};

const sizes = {
  sm: "h-8  px-3 text-xs",
  md: "h-9  px-4 text-sm",
  lg: "h-11 px-6 text-base",
};

/**
 * Button
 * @param {"primary"|"secondary"|"ghost"|"danger"} variant
 * @param {"sm"|"md"|"lg"} size
 * @param {boolean} loading
 */
function Button({
  variant = "primary",
  size    = "md",
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0"
        />
      )}
      {children}
    </button>
  );
}

export default Button;
