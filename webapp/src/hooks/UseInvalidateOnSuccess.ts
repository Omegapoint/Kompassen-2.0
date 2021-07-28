import { useEffect } from 'react';
import { useQueryClient } from 'react-query';

const useInvalidateOnSuccess = (cond: boolean, key: string): void => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (cond) queryClient.invalidateQueries(key);
  }, [cond, key, queryClient]);
};

export default useInvalidateOnSuccess;
