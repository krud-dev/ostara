import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { Configuration } from 'infra/configuration/model/configuration';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';

type Variables = {};

type Data = Configuration;

export const getConfiguration = async (variables: Variables): Promise<Data> => {
  return await window.configuration.getConfiguration();
};

export const useGetConfiguration = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getConfiguration, options);

export const useGetConfigurationQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> => useBaseQuery<Data, Variables>(['configuration'], getConfiguration, variables, options);
