import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from 'renderer/apis/base/useBaseQuery';
import { actuatorKeys } from 'renderer/apis/actuator/actuatorKeys';
import { ActuatorTestConnectionResponse } from 'infra/actuator/model/base';

type Variables = { actuatorUrl: string };

type Data = ActuatorTestConnectionResponse;

export const testConnectionByUrl = async (variables: Variables): Promise<Data> => {
  return await window.actuator.testConnectionByUrl(variables.actuatorUrl);
};

export const useTestConnectionByUrl = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(testConnectionByUrl, options);

export const useTestConnectionByUrlQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    actuatorKeys.testConnection(variables.actuatorUrl),
    testConnectionByUrl,
    variables,
    options
  );
