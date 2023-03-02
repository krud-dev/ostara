import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ThreadProfilingRequestRO } from '../../../../../common/generated_definitions';
import { crudSearch } from '../../crud/crudSearch';
import { threadProfilingRequestCrudEntity } from '../../crud/entity/entities/threadProfilingRequest.crudEntity';

type Variables = {
  instanceId: string;
};

type Data = ThreadProfilingRequestRO[];

export const getInstanceThreadProfilingRequests = async (variables: Variables): Promise<Data> => {
  const result = await crudSearch<ThreadProfilingRequestRO>({
    entity: threadProfilingRequestCrudEntity,
    filterFields: [{ fieldName: 'instanceId', operation: 'Equal', values: [variables.instanceId] }],
    orders: [{ by: 'creationTime', descending: true }],
    currentPage: 1,
    pageSize: 500,
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
