import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/requests/base/useBaseMutation';
import { ItemRO } from '../../../definitions/daemon';
import { getItemEntity } from '../../../utils/itemUtils';
import { crudCreate } from '../crud/crudCreate';
import { crudKeys } from '../crud/crudKeys';

type Variables = {
  item: ItemRO;
};

type Data = ItemRO;

export const createItem = async (variables: Variables): Promise<Data> => {
  return await crudCreate<ItemRO, ItemRO>({ entity: getItemEntity(variables.item), item: variables.item });
};

export const useCreateItem = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(createItem, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => crudKeys.entity(getItemEntity(variables.item)),
  });
