import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createGlobalState } from 'react-use';

export const useGlobalQueryClientError = createGlobalState<unknown | undefined>(undefined);
export const disableGlobalErrorMeta = { disableGlobalError: true };

const useQueryClient = (): QueryClient => {
  const [, setGlobalError] = useGlobalQueryClientError();

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
        queryCache: new QueryCache({
          onError: (error, query) => {
            // If this query has a noError meta, skip error
            if (query.options.meta?.disableGlobalError) return;

            setGlobalError(error);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            // If this mutation has a noError meta, skip error
            if (mutation.options.meta?.disableGlobalError) return;

            setGlobalError(error);
          },
        }),
      }),
    []
  );
};
export default useQueryClient;
