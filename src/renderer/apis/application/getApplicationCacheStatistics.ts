import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { ApplicationCacheStatistics, InstanceCacheStatistics } from 'infra/instance/models/cache';
import { apiKeys } from 'renderer/apis/apiKeys';

type Variables = {
  applicationId: string;
  cacheName: string;
};

type Data = ApplicationCacheStatistics;

export const getApplicationCacheStatistics = async (variables: Variables): Promise<Data> => {
  return await window.instance.getApplicationCacheStatistics(variables.applicationId, variables.cacheName);
};

export const useGetApplicationCacheStatistics = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getApplicationCacheStatistics, options);

export const useGetApplicationCacheStatisticsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemCacheStatistics(variables.applicationId, variables.cacheName),
    getApplicationCacheStatistics,
    variables,
    options
  );
