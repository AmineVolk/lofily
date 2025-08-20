import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { useFetch } from './useFetch';

const BOUNCED_TIME = 1000;

const useSearch = (url, search) => {
  const [searchBounced] = useDebounce(search, BOUNCED_TIME);
  const [loading, data, error] = useFetch(url + searchBounced);

  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, BOUNCED_TIME);
  }, [search]);

  return [isSearching, data, error];
};

export { useSearch };
