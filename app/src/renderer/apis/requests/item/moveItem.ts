import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { ItemRO, ItemType } from '../../../definitions/daemon';
import { crudKeys } from '../crud/crudKeys';
import { getItemTypeEntity } from '../../../utils/itemUtils';
import { moveFolder } from '../folder/moveFolder';
import { moveApplication } from '../application/moveApplication';
import { moveInstance } from '../instance/moveInstance';
import { moveAgent } from 'renderer/apis/requests/agent/moveAgent';

type Variables = {
  id: string;
  type: ItemType;
  parentId: string | undefined;
  sort: number;
};

type Data = ItemRO;

export const moveItem = async (variables: Variables): Promise<Data> => {
  switch (variables.type) {
    case 'folder':
      return await moveFolder({
        folderId: variables.id,
        newParentFolderId: variables.parentId,
        newSort: variables.sort,
      });
    case 'agent':
      return await moveAgent({
        agentId: variables.id,
        newParentFolderId: variables.parentId,
        newSort: variables.sort,
      });
    case 'application':
      return await moveApplication({
        applicationId: variables.id,
        newParentFolderId: variables.parentId,
        newSort: variables.sort,
      });
    case 'instance':
      if (!variables.parentId) {
        throw new Error('Instance must have a parent');
      }
      return await moveInstance({
        instanceId: variables.id,
        newParentApplicationId: variables.parentId,
        newSort: variables.sort,
      });
    default:
      throw new Error('Unknown item type');
  }
};

export const useMoveItem = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(moveItem, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => crudKeys.entity(getItemTypeEntity(variables.type)),
  });
