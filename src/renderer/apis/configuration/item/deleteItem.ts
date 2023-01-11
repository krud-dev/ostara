import { isApplication, isFolder, isInstance, Item } from 'infra/configuration/model/configuration';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';

type Variables = {
  item: Item;
};

type Data = void;

export const deleteItem = async (variables: Variables): Promise<Data> => {
  if (isFolder(variables.item)) {
    return await window.configuration.deleteFolder(variables.item.id);
  }
  if (isApplication(variables.item)) {
    return await window.configuration.deleteApplication(variables.item.id);
  }
  if (isInstance(variables.item)) {
    return await window.configuration.deleteInstance(variables.item.id);
  }
  throw new Error('Unknown item type');
};

export const useDeleteItem = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(deleteItem, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.items(),
  });
