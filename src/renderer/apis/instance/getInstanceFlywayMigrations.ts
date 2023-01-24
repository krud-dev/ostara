import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ActuatorFlywayMigration } from 'infra/actuator/model/flyway';
import { chain } from 'lodash';

export type EnrichedActuatorFlywayMigration = ActuatorFlywayMigration & { bean: string };

type Variables = {
  instanceId: string;
  context: string;
};

type Data = EnrichedActuatorFlywayMigration[];

export const getInstanceFlywayMigrations = async (variables: Variables): Promise<Data> => {
  const result = await window.actuator.flyway(variables.instanceId);
  return chain(result.contexts[variables.context]?.flywayBeans)
    .flatMap((bean, beanName) => bean.migrations.map((migration) => ({ ...migration, bean: beanName })))
    .value();
};

export const useGetInstanceFlywayMigrations = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceFlywayMigrations, options);

export const useGetInstanceFlywayMigrationsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemFlywayByContext(variables.instanceId, variables.context),
    getInstanceFlywayMigrations,
    variables,
    options
  );
