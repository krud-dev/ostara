import { QueryKey } from '@tanstack/react-query';
import { CrudVariables } from './useCrudMutation';
import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';

export type CrudQueryOptions<Data, Variables extends CrudVariables> = BaseQueryOptions<Data, Variables>;

export type CrudUseQueryResult<Data> = BaseUseQueryResult<Data>;

export const useCrudQuery = <Data, Variables extends CrudVariables>(
  queryKey: QueryKey,
  queryFn: (variables: Variables) => Promise<Data>,
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
) => useBaseQuery<Data, Variables>(queryKey, queryFn, variables, options);
