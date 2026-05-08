import { useState, useCallback } from 'react';

/**
 * React state hook backed by localStorage.
 * @template T
 * @param {string} key
 * @param {T} defaultValue
 * @returns {[T, Function, Function]}
 */
export function useLocalStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const next = typeof value === 'function' ? value(storedValue) : value;
        setStoredValue(next);
        localStorage.setItem(key, JSON.stringify(next));
      } catch (err) {
        console.warn(`useLocalStorage: could not set key "${key}"`, err);
      }
    },
    [key, storedValue],
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (err) {
      console.warn(`useLocalStorage: could not remove key "${key}"`, err);
    }
  }, [key, defaultValue]);

  return [storedValue, setValue, removeValue];
}
