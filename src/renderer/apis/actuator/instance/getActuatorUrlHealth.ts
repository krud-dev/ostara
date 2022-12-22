import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { ActuatorHealthResponse } from 'infra/actuator/model/health';
import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from 'renderer/apis/base/useBaseQuery';

type Variables = { actuatorUrl: string };

type Data = ActuatorHealthResponse;

export const getActuatorUrlHealth = async (variables: Variables): Promise<Data> => {
  return await window.actuator.health(variables.actuatorUrl);
};

export const useGetActuatorUrlHealth = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getActuatorUrlHealth, options);

export const useGetActuatorUrlHealthQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(['configuration'], getActuatorUrlHealth, variables, options);
