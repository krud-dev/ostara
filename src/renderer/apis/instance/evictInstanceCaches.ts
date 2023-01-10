import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';

type Variables = {
  instanceId: string;
  cacheNames: string[];
};

type Data = void;

export const evictInstanceCaches = async (variables: Variables): Promise<Data> => {
  return await window.instance.evictInstanceCaches(variables.instanceId, variables.cacheNames);
};

export const useEvictInstanceCaches = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(evictInstanceCaches, {
    ...options,
  });
