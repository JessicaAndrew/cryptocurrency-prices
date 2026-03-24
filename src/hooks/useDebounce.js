import { useState, useEffect } from 'react';
/**
 * Custom hook for debouncing values
 * Usage: const debouncedValue = useDebounce(value, delay)
 */
export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}
