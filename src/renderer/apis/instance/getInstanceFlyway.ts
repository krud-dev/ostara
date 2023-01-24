import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ActuatorFlywayResponse } from 'infra/actuator/model/flyway';

type Variables = {
  instanceId: string;
};

type Data = ActuatorFlywayResponse;

export const getInstanceFlyway = async (variables: Variables): Promise<Data> => {
  return await window.actuator.flyway(variables.instanceId);
};

export const useGetInstanceFlyway = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceFlyway, options);

export const useGetInstanceFlywayQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemFlyway(variables.instanceId), getInstanceFlyway, variables, options);
