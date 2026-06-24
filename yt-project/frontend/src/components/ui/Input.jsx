import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * Input — controlled, forwarded-ref input with label + error message.
 * Works seamlessly with React Hook Form.
 *
 * @param {string}  label
 * @param {string}  error
 * @param {string}  hint       - optional hint text below the input
 * @param {string}  className  - applied to the outer wrapper
 */
const Input = forwardRef(function Input(
  { label, error, hint, id, type = "text", className, ...props },
  ref
) {
  const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const isPassword = type === "password";
  const [show, setShow] = useState(false);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className="text-sm font-medium text-text-secondary"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={fieldId}
          ref={ref}
          type={isPassword ? (show ? "text" : "password") : type}
          className={cn(
            "w-full h-10 rounded-md px-3 text-sm",
            "bg-bg-elevated border border-bg-border",
            "text-text-primary placeholder:text-text-muted",
            "focus:outline-none focus:border-accent",
            "transition-colors duration-150",
            isPassword && "pr-10",
            error && "border-error focus:border-error"
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
          }
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-text-muted hover:text-text-primary transition-colors"
            tabIndex={-1}
          >
            {show ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          </button>
        )}
      </div>

      {hint && !error && (
        <p id={`${fieldId}-hint`} className="text-xs text-text-muted">
          {hint}
        </p>
      )}

      {error && (
        <p id={`${fieldId}-error`} role="alert" className="text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
