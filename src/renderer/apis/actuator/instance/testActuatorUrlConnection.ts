import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from 'renderer/apis/base/useBaseQuery';
import { actuatorKeys } from 'renderer/apis/actuator/actuatorKeys';
import { ActuatorTestConnectionResponse } from 'infra/actuator/model/base';

type Variables = { actuatorUrl: string };

type Data = ActuatorTestConnectionResponse;

export const testActuatorUrlConnection = async (variables: Variables): Promise<Data> => {
  return await window.actuator.testConnection(variables.actuatorUrl);
};

export const useTestActuatorUrlConnection = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(testActuatorUrlConnection, options);

export const useTestActuatorUrlConnectionQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    actuatorKeys.testConnection(variables.actuatorUrl),
    testActuatorUrlConnection,
    variables,
    options
  );
