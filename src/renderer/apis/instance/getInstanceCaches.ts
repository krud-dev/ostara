import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { InstanceCache } from 'infra/instance/models/cache';
import { apiKeys } from 'renderer/apis/apiKeys';

type Variables = {
  instanceId: string;
};

type Data = InstanceCache[];

export const getInstanceCaches = async (variables: Variables): Promise<Data> => {
  return await window.instance.getInstanceCaches(variables.instanceId);
};

export const useGetInstanceCaches = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceCaches, options);

export const useGetInstanceCachesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemCaches(variables.instanceId), getInstanceCaches, variables, options);
