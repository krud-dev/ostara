import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import { EnrichedItem } from 'infra/configuration/model/configuration';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { configurationKeys } from 'renderer/apis/configuration/configurationKeys';

type Variables = { id: string };

type Data = EnrichedItem | undefined;

export const getItem = async (variables: Variables): Promise<Data> => {
  return await window.configuration.getItem(variables.id);
};

export const useGetItem = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getItem, options);

export const useGetItemQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(configurationKeys.item(variables.id), getItem, variables, options);
