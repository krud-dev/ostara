import { EnrichedInstance, Instance } from 'infra/configuration/model/configuration';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { configurationKeys } from 'renderer/apis/configuration/configurationKeys';

type Variables = {
  item: Omit<Instance, 'id' | 'type'>;
};

type Data = EnrichedInstance;

export const createInstance = async (variables: Variables): Promise<Data> => {
  return await window.configuration.createInstance(variables.item);
};

export const useCreateInstance = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(createInstance, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => configurationKeys.items(),
  });
