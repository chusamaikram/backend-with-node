import {
    clsx
} from "clsx";
import {
    twMerge
} from "tailwind-merge";

/**
 * Merges Tailwind class names safely, resolving conflicts.
 * Usage: cn("px-4 py-2", condition && "bg-red-500", "py-3")
 * → "px-4 py-3 bg-red-500"  (py-3 wins over py-2)
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}