import { EnrichedItem, isApplication, isFolder, isInstance, Item } from 'infra/configuration/model/configuration';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { configurationKeys } from 'renderer/apis/configuration/configurationKeys';

type Variables = {
  item: Omit<Item, 'id'>;
};

type Data = EnrichedItem;

export const createItem = async (variables: Variables): Promise<Data> => {
  if (isFolder(variables.item)) {
    return await window.configuration.createFolder(variables.item);
  }
  if (isApplication(variables.item)) {
    return await window.configuration.createApplication(variables.item);
  }
  if (isInstance(variables.item)) {
    return await window.configuration.createInstance(variables.item);
  }
  throw new Error('Unknown item type');
};

export const useCreateItem = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(createItem, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => configurationKeys.items(),
  });
