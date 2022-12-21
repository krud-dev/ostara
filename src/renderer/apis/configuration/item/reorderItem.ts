import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';

type Variables = {
  id: string;
  order: number;
};

type Data = void;

export const reorderItem = async (variables: Variables): Promise<Data> => {
  return await window.configuration.reorderItem(variables.id, variables.order);
};

export const useReorderItem = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(reorderItem, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => ['configuration'],
  });
