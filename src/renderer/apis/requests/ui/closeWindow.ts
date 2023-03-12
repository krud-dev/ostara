import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';

type Variables = {};

type Data = void;

export const closeWindow = async (variables: Variables): Promise<Data> => {
  return await window.ui.minimizeWindow();
};

export const useCloseWindow = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(closeWindow, options);
