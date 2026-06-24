import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";

const sizes = {
  xs: "size-6  text-[9px]",
  sm: "size-8  text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-20 text-xl",
};

const fallbackColors = [
  "bg-violet-600", "bg-blue-600", "bg-emerald-600",
  "bg-orange-500", "bg-rose-600", "bg-teal-600",
];

/**
 * Avatar — image with initials fallback.
 * @param {"xs"|"sm"|"md"|"lg"|"xl"} size
 */
function Avatar({ src, alt = "", fallback = "?", size = "md", className }) {
  const [failed, setFailed] = useState(false);

  // Reset failed state whenever src changes (e.g. user logs in with a real avatar)
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImg = src && !failed;

  // Ensure fallback is always a non-empty string to avoid charCodeAt errors
  const safeFallback = fallback && String(fallback).trim() ? String(fallback) : "?";
  const bg = fallbackColors[(safeFallback.charCodeAt(0) || 0) % fallbackColors.length];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden",
        sizes[size],
        !showImg && bg,
        className
      )}
      role="img"
      aria-label={alt || fallback}
    >
      {showImg ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="font-semibold text-white uppercase leading-none select-none">
          {safeFallback.slice(0, 2)}
        </span>
      )}
    </span>
  );
}

export default Avatar;
