import { Application } from 'infra/configuration/model/configuration';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';

type Variables = {
  id: string;
  item: Omit<Application, 'id' | 'type'>;
};

type Data = Application;

export const updateApplication = async (variables: Variables): Promise<Data> => {
  return await window.configuration.updateApplication(variables.id, variables.item);
};

export const useUpdateApplication = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(updateApplication, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => ['configuration'],
  });
