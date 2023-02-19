import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/requests/base/useBaseMutation';
import { ItemRO } from '../../../definitions/daemon';
import { crudDelete } from '../crud/crudDelete';
import { getItemEntity } from '../../../utils/itemUtils';
import { crudKeys } from '../crud/crudKeys';

type Variables = {
  item: ItemRO;
};

type Data = void;

export const deleteItem = async (variables: Variables): Promise<Data> => {
  return await crudDelete({ entity: getItemEntity(variables.item), id: variables.item.id });
};

export const useDeleteItem = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(deleteItem, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => crudKeys.entity(getItemEntity(variables.item)),
  });
