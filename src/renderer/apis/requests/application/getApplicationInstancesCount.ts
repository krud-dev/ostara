import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { instanceCrudEntity } from '../crud/entity/entities/instance.crudEntity';
import { crudSearchCount } from '../crud/crudSearchCount';

type Variables = {
  applicationId: string;
};

type Data = number;

export const getApplicationInstances = async (variables: Variables): Promise<Data> => {
  const result = await crudSearchCount({
    entity: instanceCrudEntity,
    filterFields: [{ fieldName: 'parentApplicationId', operation: 'Equal', values: [variables.applicationId] }],
  });
  return result.total;
};

export const useGetApplicationInstancesCount = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getApplicationInstances, options);

export const useGetApplicationInstancesCountQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemInstancesCount(variables.applicationId),
    getApplicationInstances,
    variables,
    options
  );
