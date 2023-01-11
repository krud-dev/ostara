import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';

type Variables = {
  id: string;
};

type Data = void;

export const deleteInstance = async (variables: Variables): Promise<Data> => {
  return await window.configuration.deleteInstance(variables.id);
};

export const useDeleteInstance = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(deleteInstance, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.items(),
  });
