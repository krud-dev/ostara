import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { chain } from 'lodash';
import { getInstanceFlyway } from './getInstanceFlyway';
import { FlywayActuatorResponse$Context$FlywayBean$Migration } from '../../../../../common/generated_definitions';

export type EnrichedFlywayMigration = FlywayActuatorResponse$Context$FlywayBean$Migration & { bean: string };

type Variables = {
  instanceId: string;
  context: string;
};

type Data = EnrichedFlywayMigration[];

export const getInstanceFlywayMigrations = async (variables: Variables): Promise<Data> => {
  const result = await getInstanceFlyway({ instanceId: variables.instanceId });
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
