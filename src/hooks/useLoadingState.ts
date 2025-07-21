import { useState, useCallback } from 'react';
import type { LoadingState } from './types';

const useLoadingState = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: isLoading,
    }));
  }, []);

  const isLoading = useCallback(
    (key: string) => {
      return loadingStates[key] || false;
    },
    [loadingStates],
  );

  const withLoading = useCallback(
    async <T>(key: string, asyncFunction: () => Promise<T>): Promise<T> => {
      setLoading(key, true);
      try {
        const result = await asyncFunction();
        return result;
      } finally {
        setLoading(key, false);
      }
    },
    [setLoading],
  );

  return {
    loadingStates,
    setLoading,
    isLoading,
    withLoading,
  };
};

export default useLoadingState;
