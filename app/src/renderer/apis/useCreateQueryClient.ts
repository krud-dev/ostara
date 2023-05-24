import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

const useCreateQueryClient = (): QueryClient => {
  return useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            refetchInterval: false,
            refetchIntervalInBackground: false,
            retry: false,
          },
        },
        queryCache: new QueryCache({}),
        mutationCache: new MutationCache({}),
      }),
    []
  );
};
export default useCreateQueryClient;
