import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { isServiceInactive } from 'renderer/utils/itemUtils';
import { InstanceCacheRO, InstanceRO } from '../../../../common/generated_definitions';
import { axiosInstance } from '../../axiosInstance';
import { AxiosResponse } from 'axios';

export type EnrichedInstanceCacheRO = InstanceCacheRO & {
  hasStatistics: boolean;
};

type Variables = {
  instance: InstanceRO;
};

type Data = EnrichedInstanceCacheRO[];

export const getInstanceCaches = async (variables: Variables): Promise<Data> => {
  const hasStatistics = !isServiceInactive(variables.instance, 'CACHE_STATISTICS');
  const result = (
    await axiosInstance.get<InstanceCacheRO[], AxiosResponse<InstanceCacheRO[]>>(
      `cache/instance/${variables.instance.id}`
    )
  ).data;
  return result.map((cache) => ({ ...cache, hasStatistics: hasStatistics }));
};

export const useGetInstanceCaches = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceCaches, options);

export const useGetInstanceCachesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemCaches(variables.instance.id), getInstanceCaches, variables, options);
