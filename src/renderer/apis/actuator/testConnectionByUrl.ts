import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from 'renderer/apis/base/useBaseQuery';
import { ActuatorTestConnectionResponse } from 'infra/actuator/model/base';
import { apiKeys } from 'renderer/apis/apiKeys';

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
    apiKeys.actuatorConnection(variables.actuatorUrl),
    testConnectionByUrl,
    variables,
    options
  );
