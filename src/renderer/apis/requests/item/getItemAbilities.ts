import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { InstanceAbility } from '../../../../common/generated_definitions';
import { ItemRO } from '../../../definitions/daemon';
import { isApplication, isInstance } from '../../../utils/itemUtils';
import { getInstanceAbilities } from '../instance/getInstanceAbilities';
import { getApplicationAbilities } from '../application/getApplicationAbilities';

type Variables = {
  item?: ItemRO;
};

type Data = InstanceAbility[];

export const getItemAbilities = async (variables: Variables): Promise<Data> => {
  if (!variables.item) {
    return [];
  }
  if (isInstance(variables.item)) {
    return await getInstanceAbilities({ instanceId: variables.item.id });
  }
  if (isApplication(variables.item)) {
    return await getApplicationAbilities({ applicationId: variables.item.id });
  }
  return [];
};

export const useGetItemAbilities = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getItemAbilities, options);

export const useGetItemAbilitiesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemAbilities(variables.item?.id || ''), getItemAbilities, variables, options);
