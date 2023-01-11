import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';

type Variables = {
  id: string;
};

type Data = void;

export const deleteApplication = async (variables: Variables): Promise<Data> => {
  return await window.configuration.deleteApplication(variables.id);
};

export const useDeleteApplication = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(deleteApplication, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.items(),
  });
