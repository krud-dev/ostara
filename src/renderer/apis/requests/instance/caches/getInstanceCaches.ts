import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { InstanceCacheRO } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';

export type EnrichedInstanceCacheRO = InstanceCacheRO & {
  instanceId: string;
  hasStatistics: boolean;
};

type Variables = {
  instanceId: string;
  hasStatistics: boolean;
};

type Data = EnrichedInstanceCacheRO[];

export const getInstanceCaches = async (variables: Variables): Promise<Data> => {
  const result = (
    await axiosInstance.get<InstanceCacheRO[], AxiosResponse<InstanceCacheRO[]>>(
      `cache/instance/${variables.instanceId}`
    )
  ).data;
  return result.map((cache) => ({
    ...cache,
    instanceId: variables.instanceId,
    hasStatistics: variables.hasStatistics,
  }));
};

export const useGetInstanceCaches = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceCaches, options);

export const useGetInstanceCachesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemCaches(variables.instanceId), getInstanceCaches, variables, options);
