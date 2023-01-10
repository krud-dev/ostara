import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';

type Variables = {
  instanceId: string;
};

type Data = void;

export const evictAllInstanceCaches = async (variables: Variables): Promise<Data> => {
  return await window.instance.evictAllInstanceCaches(variables.instanceId);
};

export const useEvictAllInstanceCaches = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(evictAllInstanceCaches, {
    ...options,
  });
