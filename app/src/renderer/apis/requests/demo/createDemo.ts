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

type Variables = {
  actuatorUrl: string;
};

type Data = void;

export const createDemo = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.post<Data, AxiosResponse<Data>, null>(`demo`, null, {
      params: {
        actuatorUrl: variables.actuatorUrl,
      },
    })
  ).data;
};

export const useCreateDemo = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(createDemo, {
    ...options,
    invalidateQueriesKeysFn: (data, variables) => [
      crudKeys.entity(instanceCrudEntity),
      crudKeys.entity(applicationCrudEntity),
    ],
  });
