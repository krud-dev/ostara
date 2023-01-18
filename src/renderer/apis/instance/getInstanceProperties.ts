import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';

export type InstanceProperties = { [key: string]: { [key: string]: unknown } };

type Variables = {
  instanceId: string;
};

type Data = InstanceProperties;

export const getInstanceProperties = async (variables: Variables): Promise<Data> => {
  return await window.instance.propertyService.getProperties(variables.instanceId);
};

export const useGetInstanceProperties = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceProperties, options);

export const useGetInstancePropertiesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemProperties(variables.instanceId),
    getInstanceProperties,
    variables,
    options
  );
