import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { InstanceRO } from '../../../../common/generated_definitions';
import { crudSearch, CrudSearchVariables } from '../crud/crudSearch';
import { instanceCrudEntity } from '../crud/entity/entities/instance.crudEntity';

type Variables = Omit<CrudSearchVariables, 'entity'> & {
  applicationId: string;
};

type Data = InstanceRO[];

export const getApplicationInstances = async (variables: Variables): Promise<Data> => {
  const { applicationId, filterFields, ...rest } = variables;
  const result = await crudSearch<InstanceRO>({
    entity: instanceCrudEntity,
    filterFields: [
      { fieldName: 'parentApplicationId', operation: 'Equal', values: [applicationId] },
      ...(filterFields || []),
    ],
    ...rest,
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
