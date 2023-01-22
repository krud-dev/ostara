import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { InstanceCacheStatistics } from 'infra/instance/models/cache';
import { apiKeys } from 'renderer/apis/apiKeys';

type Variables = {
  instanceId: string;
  cacheName: string;
};

type Data = InstanceCacheStatistics;

export const getInstanceCacheStatistics = async (variables: Variables): Promise<Data> => {
  return await window.instance.getInstanceCacheStatistics(variables.instanceId, variables.cacheName);
};

export const useGetInstanceCacheStatistics = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceCacheStatistics, options);

export const useGetInstanceCacheStatisticsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemCacheStatistics(variables.instanceId, variables.cacheName),
    getInstanceCacheStatistics,
    variables,
    options
  );
