import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';

type Variables = {
  applicationId: string;
};

type Data = void;

export const evictAllApplicationCaches = async (variables: Variables): Promise<Data> => {
  return await window.instance.evictAllApplicationCaches(variables.applicationId);
};

export const useEvictAllApplicationCaches = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(evictAllApplicationCaches, {
    ...options,
  });
