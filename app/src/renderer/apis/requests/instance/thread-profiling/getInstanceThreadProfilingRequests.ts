import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from 'renderer/apis/requests/base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ThreadProfilingRequestRO } from 'common/generated_definitions';
import { crudSearch } from 'renderer/apis/requests/crud/crudSearch';
import { threadProfilingRequestCrudEntity } from 'renderer/apis/requests/crud/entity/entities/threadProfilingRequest.crudEntity';

export type EnrichedThreadProfilingRequestRO = ThreadProfilingRequestRO & {
  secondsRemaining?: number;
};

type Variables = {
  instanceId: string;
};

type Data = EnrichedThreadProfilingRequestRO[];

export const getInstanceThreadProfilingRequests = async (variables: Variables): Promise<Data> => {
  const result = await crudSearch<ThreadProfilingRequestRO>({
    entity: threadProfilingRequestCrudEntity,
    filterFields: [{ fieldName: 'instanceId', operation: 'Equal', values: [variables.instanceId] }],
    orders: [{ by: 'creationTime', descending: true }],
    currentPage: 1,
    pageSize: 1000,
  });
  return result.results;
};

export const useGetInstanceThreadProfilingRequests = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getInstanceThreadProfilingRequests, options);

export const useGetInstanceThreadProfilingRequestsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemThreadProfilingRequests(variables.instanceId),
    getInstanceThreadProfilingRequests,
    variables,
    options
  );
