import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query/src/types';
import { QueryKey, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { disableGlobalErrorMeta } from '../../ApiErrorManager';

export type BaseQueryOptions<Data, Variables> = Omit<
  UseQueryOptions<Data, unknown, Data>,
  'queryKey' | 'queryFn' | 'initialData'
> & {
  initialData?: Data | (() => Data);
  disableGlobalError?: boolean;
};

export type BaseUseQueryResult<Data> = UseQueryResult<Data>;

export const useBaseQuery = <Data, Variables>(
  queryKey: QueryKey,
  queryFn: (variables: Variables) => Promise<Data>,
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> => {
  const queryFnInternal = useMemo<() => Promise<Data>>(() => () => queryFn(variables), [queryFn, variables]);

  return useQuery<Data, unknown, Data>({
    ...options,
    meta: {
      ...options?.meta,
      ...(options?.disableGlobalError ? disableGlobalErrorMeta : undefined),
    },
    queryKey,
    queryFn: queryFnInternal,
  });
};
