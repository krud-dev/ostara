import { Application, EnrichedApplication } from 'infra/configuration/model/configuration';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { configurationKeys } from 'renderer/apis/configuration/configurationKeys';

type Variables = {
  id: string;
  item: Omit<Application, 'id' | 'type'>;
};

type Data = EnrichedApplication;

export const updateApplication = async (variables: Variables): Promise<Data> => {
  return await window.configuration.updateApplication(variables.id, variables.item);
};

export const useUpdateApplication = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(updateApplication, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => configurationKeys.items(),
  });
