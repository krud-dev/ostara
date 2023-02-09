import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { ApplicationCache } from 'infra/instance/models/cache';
import { apiKeys } from 'renderer/apis/apiKeys';

export type EnrichedApplicationCache = ApplicationCache & {
  hasStatistics: boolean;
};

type Variables = {
  applicationId: string;
};

type Data = EnrichedApplicationCache[];

export const getApplicationCaches = async (variables: Variables): Promise<Data> => {
  const hasStatistics = true; // TODO update once application has abilities
  const result = await window.instance.getApplicationCaches(variables.applicationId);
  return result.map((cache) => ({ ...cache, hasStatistics: hasStatistics }));
};

export const useGetApplicationCaches = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getApplicationCaches, options);

export const useGetApplicationCachesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemCaches(variables.applicationId), getApplicationCaches, variables, options);
