import { useEffect, useState } from 'react';
/**
 * Custom hook for async operations
 * Usage: const { data, loading, error } = useAsync(() => fetchData(), [dependency])
 */
export function useAsync(asyncFunction, immediate = true, deps) {
    const [state, setState] = useState({
        data: null,
        loading: immediate,
        error: null,
    });
    const execute = async () => {
        setState({ data: null, loading: true, error: null });
        try {
            const response = await asyncFunction();
            setState({ data: response, loading: false, error: null });
        }
        catch (error) {
            setState({
                data: null,
                loading: false,
                error: error instanceof Error ? error : new Error('Unknown error'),
            });
        }
    };
    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, deps);
    return state;
}
