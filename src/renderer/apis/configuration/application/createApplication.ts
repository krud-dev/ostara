import { Application } from 'infra/configuration/model/configuration';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';

type Variables = {
  item: Omit<Application, 'id' | 'type'>;
};

type Data = Application;

export const createApplication = async (variables: Variables): Promise<Data> => {
  return await window.configuration.createApplication(variables.item);
};

export const useCreateApplication = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(createApplication, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => ['configuration'],
  });
