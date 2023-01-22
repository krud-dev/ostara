import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { InstanceCache } from 'infra/instance/models/cache';
import { apiKeys } from 'renderer/apis/apiKeys';
import { EnrichedInstance } from 'infra/configuration/model/configuration';
import { isServiceInactive } from 'renderer/utils/itemUtils';

export type EnrichedInstanceCache = InstanceCache & {
  hasStatistics: boolean;
};

type Variables = {
  instance: EnrichedInstance;
};

type Data = EnrichedInstanceCache[];

export const getInstanceCaches = async (variables: Variables): Promise<Data> => {
  const hasStatistics = !isServiceInactive(variables.instance, 'cache-statistics');
  const result = await window.instance.getInstanceCaches(variables.instance.id);
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
