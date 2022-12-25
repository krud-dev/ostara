import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';

type Variables = {
  id: string;
  color?: string;
};

type Data = void;

export const setItemColor = async (variables: Variables): Promise<Data> => {
  return await window.configuration.setColor(variables.id, variables.color);
};

export const useSetItemColor = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(setItemColor, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => ['configuration'],
  });
