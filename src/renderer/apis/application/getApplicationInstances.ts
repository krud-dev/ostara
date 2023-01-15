import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { EnrichedInstance } from 'infra/configuration/model/configuration';

type Variables = {
  applicationId: string;
};

type Data = EnrichedInstance[];

export const getApplicationInstances = async (variables: Variables): Promise<Data> => {
  const result = await window.configuration.getItems();
  return result
    .filter((item) => item.type === 'instance' && item.parentApplicationId === variables.applicationId)
    .map<EnrichedInstance>((item) => item as EnrichedInstance);
};

export const useGetApplicationInstances = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getApplicationInstances, options);

export const useGetApplicationInstancesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemCaches(variables.applicationId),
    getApplicationInstances,
    variables,
    options
  );
