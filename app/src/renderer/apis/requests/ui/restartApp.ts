import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';

type Variables = {};

type Data = void;

export const restartApp = async (variables: Variables): Promise<Data> => {
  return await window.ui.restartApp();
};

export const useRestartApp = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(restartApp, options);
