import { EnrichedItem, isApplication, isFolder, isInstance, Item } from 'infra/configuration/model/configuration';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';

type Variables = {
  item: Item;
};

type Data = EnrichedItem;

export const updateItem = async (variables: Variables): Promise<Data> => {
  if (isFolder(variables.item)) {
    return await window.configuration.updateFolder(variables.item.id, variables.item);
  }
  if (isApplication(variables.item)) {
    return await window.configuration.updateApplication(variables.item.id, variables.item);
  }
  if (isInstance(variables.item)) {
    return await window.configuration.updateInstance(variables.item.id, variables.item);
  }
  throw new Error('Unknown item type');
};

export const useUpdateItem = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(updateItem, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.items(),
  });
