import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { EnrichedItem } from 'infra/configuration/model/configuration';
import { configurationKeys } from 'renderer/apis/configuration/configurationKeys';

type Variables = {
  id: string;
  type: string;
  parentId: string | undefined;
  order: number;
};

type Data = EnrichedItem;

export const moveItem = async (variables: Variables): Promise<Data> => {
  switch (variables.type) {
    case 'folder':
      return await window.configuration.moveFolder(variables.id, variables.parentId, variables.order);
    case 'application':
      return await window.configuration.moveApplication(variables.id, variables.parentId, variables.order);
    case 'instance':
      if (!variables.parentId) {
        throw new Error('Instance must have a parent');
      }
      return await window.configuration.moveInstance(variables.id, variables.parentId, variables.order);
    default:
      throw new Error('Unknown item type');
  }
};

export const useMoveItem = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(moveItem, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => configurationKeys.items(),
  });
