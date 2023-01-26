import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { chain } from 'lodash';
import { ActuatorLiquibaseChangeset } from 'infra/actuator/model/liquibase';

export type EnrichedActuatorLiquibaseChangeset = ActuatorLiquibaseChangeset & { bean: string };

type Variables = {
  instanceId: string;
  context: string;
};

type Data = EnrichedActuatorLiquibaseChangeset[];

export const getInstanceLiquibaseChangesets = async (variables: Variables): Promise<Data> => {
  const result = await window.actuator.liquibase(variables.instanceId);
  return chain(result.contexts[variables.context]?.liquibaseBeans)
    .flatMap((bean, beanName) => bean.changeSets.map((changeset) => ({ ...changeset, bean: beanName })))
    .value();
};

export const useGetInstanceLiquibaseChangesets = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceLiquibaseChangesets, options);

export const useGetInstanceLiquibaseChangesetsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemLiquibaseByContext(variables.instanceId, variables.context),
    getInstanceLiquibaseChangesets,
    variables,
    options
  );
