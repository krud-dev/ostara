import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ApplicationCacheRO } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';
import { getApplicationAbilities } from '../getApplicationAbilities';

export type EnrichedApplicationCacheRO = ApplicationCacheRO & {
  applicationId: string;
  hasStatistics: boolean;
};

type Variables = {
  applicationId: string;
};

type Data = EnrichedApplicationCacheRO[];

export const getApplicationCaches = async (variables: Variables): Promise<Data> => {
  const abilities = await getApplicationAbilities(variables);
  const hasStatistics = abilities.indexOf('CACHE_STATISTICS') > -1;

  const result = (
    await axiosInstance.get<ApplicationCacheRO[], AxiosResponse<ApplicationCacheRO[]>>(
      `cache/application/${variables.applicationId}`
    )
  ).data;
  return result.map((cache) => ({ ...cache, applicationId: variables.applicationId, hasStatistics: hasStatistics }));
};

export const useGetApplicationCaches = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getApplicationCaches, options);

export const useGetApplicationCachesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemCaches(variables.applicationId), getApplicationCaches, variables, options);
