import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from 'renderer/apis/requests/base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { InstanceHeapdumpReferenceRO } from 'common/generated_definitions';
import { crudSearch } from 'renderer/apis/requests/crud/crudSearch';
import { heapdumpReferenceCrudEntity } from 'renderer/apis/requests/crud/entity/entities/heapdumpReference.crudEntity';

export type EnrichedInstanceHeapdumpReferenceRO = InstanceHeapdumpReferenceRO & {
  bytesRead?: number;
};

type Variables = {
  instanceId: string;
};

type Data = EnrichedInstanceHeapdumpReferenceRO[];

export const getInstanceHeapdumpReferences = async (variables: Variables): Promise<Data> => {
  const result = await crudSearch<InstanceHeapdumpReferenceRO>({
    entity: heapdumpReferenceCrudEntity,
    filterFields: [{ fieldName: 'instanceId', operation: 'Equal', values: [variables.instanceId] }],
    orders: [{ by: 'creationTime', descending: true }],
    currentPage: 1,
    pageSize: 1000,
  });
  return result.results;
};

export const useGetInstanceHeapdumpReferences = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceHeapdumpReferences, options);

export const useGetInstanceHeapdumpReferencesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemHeapdumps(variables.instanceId),
    getInstanceHeapdumpReferences,
    variables,
    options
  );
