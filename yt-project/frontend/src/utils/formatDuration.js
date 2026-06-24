/**
 * Converts a duration in seconds to a human-readable string.
 * @param {number} seconds
 * @returns {string} e.g. "3:04" | "1:02:45"
 */
export function formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";

    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const paddedSecs = String(secs).padStart(2, "0");
    const paddedMins = hours > 0 ? String(minutes).padStart(2, "0") : String(minutes);

    return hours > 0 ?
        `${hours}:${paddedMins}:${paddedSecs}` :
        `${paddedMins}:${paddedSecs}`;
}