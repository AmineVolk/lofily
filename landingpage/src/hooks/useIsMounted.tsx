import { useEffect, useState } from 'react';

function useIsMounted() {
  const [isMounted, setisMounted] = useState(false);
  useEffect(() => {
    setisMounted(true);
  }, []);

  return [isMounted];
}

export { useIsMounted };
