import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ActuatorEnvResponse } from 'infra/actuator/model/env';

type Variables = {
  instanceId: string;
};

type Data = ActuatorEnvResponse;

export const getInstanceEnv = async (variables: Variables): Promise<Data> => {
  return await window.actuator.env(variables.instanceId);
};

export const useGetInstanceEnv = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceEnv, options);

export const useGetInstanceEnvQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemEnv(variables.instanceId), getInstanceEnv, variables, options);
