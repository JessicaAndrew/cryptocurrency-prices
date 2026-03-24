import { useState } from 'react';
/**
 * Custom hook for localStorage persistence
 * Usage: const [value, setValue] = useLocalStorage('key', defaultValue)
 */
export function useLocalStorage(key, defaultValue) {
    const [value, setValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        }
        catch {
            console.warn(`Failed to read localStorage key "${key}"`);
            return defaultValue;
        }
    });
    const setStoredValue = (newValue) => {
        try {
            setValue(newValue);
            window.localStorage.setItem(key, JSON.stringify(newValue));
        }
        catch {
            console.warn(`Failed to write to localStorage key "${key}"`);
        }
    };
    return [value, setStoredValue];
}
