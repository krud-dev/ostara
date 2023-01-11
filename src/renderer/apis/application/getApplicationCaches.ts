import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { ApplicationCache } from 'infra/instance/models/cache';
import { apiKeys } from 'renderer/apis/apiKeys';

type Variables = {
  applicationId: string;
};

type Data = ApplicationCache[];

export const getApplicationCaches = async (variables: Variables): Promise<Data> => {
  return await window.instance.getApplicationCaches(variables.applicationId);
};

export const useGetApplicationCaches = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getApplicationCaches, options);

export const useGetApplicationCachesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemCaches(variables.applicationId), getApplicationCaches, variables, options);
