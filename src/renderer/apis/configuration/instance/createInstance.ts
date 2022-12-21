import { Instance } from 'infra/configuration/model/configuration';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';

type Variables = {
  item: Omit<Instance, 'id' | 'type'>;
};

type Data = Instance;

export const createInstance = async (variables: Variables): Promise<Data> => {
  return await window.configuration.createInstance(variables.item);
};

export const useCreateInstance = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(createInstance, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => ['configuration'],
  });
