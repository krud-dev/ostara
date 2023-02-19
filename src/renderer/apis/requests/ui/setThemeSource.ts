import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ThemeSource } from '../../../../infra/ui/models/electronTheme';

type Variables = {
  themeSource: ThemeSource;
};

type Data = void;

export const setThemeSource = async (variables: Variables): Promise<Data> => {
  return await window.ui.setThemeSource(variables.themeSource);
};

export const useSetThemeSource = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(setThemeSource, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.themeSource(),
  });
