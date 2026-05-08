import { useState, useEffect } from 'react';

/**
 * Debounce a value by the given delay in milliseconds.
 * Returns the debounced value that only updates after the user stops changing it.
 *
 * @template T
 * @param {T} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default 300ms)
 * @returns {T} The debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
