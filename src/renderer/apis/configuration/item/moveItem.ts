import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { Item } from 'infra/configuration/model/configuration';

type Variables = {
  id: string;
  type: string;
  parentId: string;
  order: number;
};

type Data = Item;

export const moveItem = async (variables: Variables): Promise<Item> => {
  switch (variables.type) {
    case 'folder':
      return await window.configuration.moveFolder(variables.id, variables.parentId, variables.order);
    case 'application':
      return await window.configuration.moveApplication(variables.id, variables.parentId, variables.order);
    case 'instance':
      return await window.configuration.moveInstance(variables.id, variables.parentId, variables.order);
  }
  throw new Error('Unknown item type');
};

export const useMoveItem = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(moveItem, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => ['configuration'],
  });
