import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { axiosInstance } from '../../../axiosInstance';
import { InstanceCacheStatisticsRO } from '../../../../../common/generated_definitions';
import { AxiosResponse } from 'axios';

type Variables = {
  instanceId: string;
  cacheName: string;
};

type Data = InstanceCacheStatisticsRO;

export const getInstanceCacheStatistics = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.get<Data, AxiosResponse<Data>>(
      `cache/instance/${variables.instanceId}/${variables.cacheName}/statistics`
    )
  ).data;
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
