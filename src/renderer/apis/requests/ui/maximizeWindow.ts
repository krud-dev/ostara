import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/requests/base/useBaseMutation';

type Variables = {};

type Data = void;

export const maximizeWindow = async (variables: Variables): Promise<Data> => {
  return await window.ui.maximizeWindow();
};

export const useMaximizeWindow = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(maximizeWindow, options);
