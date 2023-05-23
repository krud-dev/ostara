import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { axiosInstance } from '../../axiosInstance';
import { AxiosResponse } from 'axios';
import { crudKeys } from '../crud/crudKeys';
import { instanceCrudEntity } from '../crud/entity/entities/instance.crudEntity';
import { applicationCrudEntity } from '../crud/entity/entities/application.crudEntity';

type Variables = {};

type Data = void;

export const deleteDemo = async (variables: Variables): Promise<Data> => {
  return (await axiosInstance.delete<Data, AxiosResponse<Data>, null>(`demo`)).data;
};

export const useDeleteDemo = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(deleteDemo, {
    ...options,
    invalidateQueriesKeysFn: (data, variables) => [
      crudKeys.entity(instanceCrudEntity),
      crudKeys.entity(applicationCrudEntity),
    ],
  });
