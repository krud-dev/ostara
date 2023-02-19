import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/requests/base/useBaseMutation';
import { axiosInstance } from '../../axiosInstance';
import { AxiosResponse } from 'axios';
import { InstanceRO } from '../../../../common/generated_definitions';
import { crudKeys } from '../crud/crudKeys';
import { instanceCrudEntity } from '../crud/entity/entities/instance.crud-entity';

type Variables = {
  instanceId: string;
  newParentApplicationId: string;
  newSort: number;
};

type Data = InstanceRO;

export const moveInstance = async (variables: Variables): Promise<Data> => {
  const { instanceId, newParentApplicationId, newSort } = variables;

  const result = await axiosInstance.post<Data, AxiosResponse<Data>, null>(
    `${instanceCrudEntity.path}/${instanceId}/move`,
    null,
    { params: { newParentApplicationId, newSort } }
  );
  return result.data;
};

export const useMoveInstance = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(moveInstance, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => crudKeys.entity(instanceCrudEntity),
  });
