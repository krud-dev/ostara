import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { InstanceHealth } from 'infra/configuration/model/configuration';

type Variables = {
  instanceId: string;
};

type Data = InstanceHealth;

export const fetchInstanceHealth = async (variables: Variables): Promise<Data> => {
  return await window.instance.fetchInstanceHealthById(variables.instanceId);
};

export const useFetchInstanceHealth = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(fetchInstanceHealth, {
    ...options,
  });
