import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { ItemType } from 'infra/configuration/model/configuration';
import { ItemRO } from '../../definitions/daemon';
import { crudKeys } from '../crud/crudKeys';
import { getItemTypeEntity } from '../../utils/itemUtils';

type Variables = {
  id: string;
  type: ItemType;
  parentId: string | undefined;
  sort: number;
};

type Data = ItemRO;

export const moveItem = async (variables: Variables): Promise<Data> => {
  throw new Error('Not implemented');
  // switch (variables.type) {
  //   case 'folder':
  //     return await window.configuration.moveFolder(variables.id, variables.parentId, variables.sort);
  //   case 'application':
  //     return await window.configuration.moveApplication(variables.id, variables.parentId, variables.sort);
  //   case 'instance':
  //     if (!variables.parentId) {
  //       throw new Error('Instance must have a parent');
  //     }
  //     return await window.configuration.moveInstance(variables.id, variables.parentId, variables.sort);
  //   default:
  //     throw new Error('Unknown item type');
  // }
};

export const useMoveItem = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(moveItem, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => crudKeys.entity(getItemTypeEntity(variables.type)),
  });
