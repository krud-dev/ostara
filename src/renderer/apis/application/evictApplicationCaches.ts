import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';

type Variables = {
  applicationId: string;
  cacheNames: string[];
};

type Data = void;

export const evictApplicationCaches = async (variables: Variables): Promise<Data> => {
  return await window.instance.evictApplicationCaches(variables.applicationId, variables.cacheNames);
};

export const useEvictApplicationCaches = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(evictApplicationCaches, {
    ...options,
  });
