import { useState, useEffect } from "react";

/**
 * useDebounce — delays updating a value until the user stops changing it.
 *
 * How it works:
 *   Every time `value` changes, we set a timer for `delay` ms.
 *   If `value` changes again before the timer fires, we clear the old
 *   timer and start a new one. The debounced value only updates once
 *   the user has stopped changing it for `delay` ms.
 *
 * Why useEffect with a cleanup?
 *   The cleanup function (return () => clearTimeout) runs before the
 *   next effect execution. So if value changes rapidly, previous timers
 *   are always cleared before a new one starts — only the last one fires.
 *
 * @param {any}    value  - the value to debounce (typically a search string)
 * @param {number} delay  - ms to wait before updating (default 300ms)
 * @returns debounced value
 */
function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup: clear the timer if value changes before delay fires
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
