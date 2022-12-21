import { Instance } from 'infra/configuration/model/configuration';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';

type Variables = {
  id: string;
  item: Omit<Instance, 'id' | 'type'>;
};

type Data = Instance;

export const updateInstance = async (variables: Variables): Promise<Data> => {
  return await window.configuration.updateInstance(variables.id, variables.item);
};

export const useUpdateInstance = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(updateInstance, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => ['configuration'],
  });
