import { AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * Inline error message for API failures.
 * Usage: <ErrorMessage message={error} />
 */
function ErrorMessage({ message, className }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-lg bg-error/10 border border-error/20 px-3 py-2.5 text-sm text-error",
        className
      )}
    >
      <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export default ErrorMessage;
