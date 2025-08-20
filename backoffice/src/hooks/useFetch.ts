import { useEffect, useState } from 'react';

import { api } from '@/services/api/api';

function useFetch<T = unknown>(
  url: string
): { loading: boolean; data: T | null; errorStatus: number } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(url);
        setLoading(false);
        setData(response.data);
      } catch (err) {
        setErrorStatus(err as number);
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { loading, data, errorStatus };
}

export { useFetch };
