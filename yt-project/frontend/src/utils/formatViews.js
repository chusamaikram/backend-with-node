/**
 * Formats a view count into a compact human-readable string.
 * @param {number} count
 * @returns {string} e.g. "1.2M views" | "45K views" | "892 views"
 */
export function formatViews(count) {
    if (!count || isNaN(count)) return "0 views";

    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1).replace(/\.0$/, "")}M views`;
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K views`;
    }
    return `${count} ${count === 1 ? "view" : "views"}`;
}