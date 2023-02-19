import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ElectronTheme } from 'infra/ui/models/electronTheme';

type Variables = {};

type Data = ElectronTheme;

export const getTheme = async (variables: Variables): Promise<Data> => {
  return await window.ui.getTheme();
};

export const useGetTheme = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getTheme, options);

export const useGetThemeQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> => useBaseQuery<Data, Variables>(apiKeys.theme(), getTheme, variables, options);
