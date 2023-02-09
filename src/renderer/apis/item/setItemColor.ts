import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ItemType } from '../../../infra/configuration/model/configuration';
import { crudKeys } from '../crud/crudKeys';
import { getItemTypeEntity } from '../../utils/itemUtils';

type Variables = {
  id: string;
  type: ItemType;
  color?: string;
};

type Data = void;

export const setItemColor = async (variables: Variables): Promise<Data> => {
  throw new Error('Not implemented');
  // return await window.configuration.setColor(variables.id, variables.color);
};

export const useSetItemColor = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(setItemColor, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => crudKeys.entity(getItemTypeEntity(variables.type)),
  });
