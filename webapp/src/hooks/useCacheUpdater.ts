import { useCallback, useState } from 'react';

const useCacheUpdater = (): [string, () => void] => {
  const [cacheKey, setCacheKey] = useState(Math.random().toString());
  const updateCache = useCallback(() => setCacheKey(Math.random().toString()), []);
  return [cacheKey, updateCache];
};

export default useCacheUpdater;
