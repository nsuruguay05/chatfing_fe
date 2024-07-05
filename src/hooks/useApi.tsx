import { useState, useCallback } from 'react';

const useApi = <T, P>(apiFunc: (params: P) => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const execute = useCallback(async (params: P) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunc(params);
      setData(result);
      return result;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { data, error, loading, execute };
};

export default useApi;