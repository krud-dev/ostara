import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { InstanceRO } from '../../../common/generated_definitions';
import { crudSearch } from '../crud/crudSearch';
import { instanceCrudEntity } from '../crud/entity/entities/instance.crud-entity';

type Variables = {
  applicationId: string;
};

type Data = InstanceRO[];

export const getApplicationInstances = async (variables: Variables): Promise<Data> => {
  const result = await crudSearch<InstanceRO>({
    entity: instanceCrudEntity,
    filterFields: [{ fieldName: 'parentApplicationId', operation: 'Equal', values: [variables.applicationId] }],
  });
  return result.results;
};

export const useGetApplicationInstances = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getApplicationInstances, options);

export const useGetApplicationInstancesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemInstances(variables.applicationId),
    getApplicationInstances,
    variables,
    options
  );
