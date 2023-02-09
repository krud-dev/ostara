import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { ItemRO } from '../../definitions/daemon';
import { crudUpdate } from '../crud/crudUpdate';
import { getItemEntity } from '../../utils/itemUtils';
import { crudKeys } from '../crud/crudKeys';

type Variables = {
  item: ItemRO;
};

type Data = ItemRO;

export const updateItem = async (variables: Variables): Promise<Data> => {
  return await crudUpdate<ItemRO, ItemRO>({
    entity: getItemEntity(variables.item),
    item: variables.item,
    id: variables.item.id,
  });
};

export const useUpdateItem = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(updateItem, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => crudKeys.entity(getItemEntity(variables.item)),
  });
