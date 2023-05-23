import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';

type Variables = {};

type Data = void;

export const minimizeWindow = async (variables: Variables): Promise<Data> => {
  return await window.ui.minimizeWindow();
};

export const useMinimizeWindow = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(minimizeWindow, options);
