import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ApplicationCacheStatisticsRO } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {
  applicationId: string;
  cacheName: string;
};

type Data = ApplicationCacheStatisticsRO;

export const getApplicationCacheStatistics = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.get<Data, AxiosResponse<Data>>(
      `cache/application/${variables.applicationId}/${variables.cacheName}/statistics`
    )
  ).data;
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
