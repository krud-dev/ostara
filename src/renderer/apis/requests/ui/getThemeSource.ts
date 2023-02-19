import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ThemeSource } from '../../../../infra/ui/models/electronTheme';

type Variables = {};

type Data = ThemeSource;

export const getThemeSource = async (variables: Variables): Promise<Data> => {
  return await window.ui.getThemeSource();
};

export const useGetThemeSource = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getThemeSource, options);

export const useGetThemeSourceQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> => useBaseQuery<Data, Variables>(apiKeys.theme(), getThemeSource, variables, options);
