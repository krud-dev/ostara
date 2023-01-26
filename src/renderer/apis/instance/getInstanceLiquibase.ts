import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ActuatorFlywayResponse } from 'infra/actuator/model/flyway';
import { ActuatorLiquibaseResponse } from 'infra/actuator/model/liquibase';

type Variables = {
  instanceId: string;
};

type Data = ActuatorLiquibaseResponse;

export const getInstanceLiquibase = async (variables: Variables): Promise<Data> => {
  return await window.actuator.liquibase(variables.instanceId);
};

export const useGetInstanceLiquibase = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceLiquibase, options);

export const useGetInstanceLiquibaseQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemLiquibase(variables.instanceId), getInstanceLiquibase, variables, options);
