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
import { folderCrudEntity } from '../crud/entity/entities/folder.crudEntity';

type Variables = {
  jsonData: string;
};

type Data = void;

export const importAll = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.post<Data, AxiosResponse<Data>, string>(`backup/importAll`, variables.jsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).data;
};

export const useImportAll = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(importAll, {
    ...options,
    invalidateQueriesKeysFn: (data, variables) => [
      crudKeys.entity(instanceCrudEntity),
      crudKeys.entity(applicationCrudEntity),
      crudKeys.entity(folderCrudEntity),
    ],
  });
