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
import { agentCrudEntity } from 'renderer/apis/requests/crud/entity/entities/agent.crudEntity';

type Variables = {
  jsonData: string;
};

type Data = void;

export const importBackup = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.post<Data, AxiosResponse<Data>, string>(`backup/importAll`, variables.jsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).data;
};

export const useImportBackup = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(importBackup, {
    ...options,
    invalidateQueriesKeysFn: (data, variables) => [
      crudKeys.entity(instanceCrudEntity),
      crudKeys.entity(applicationCrudEntity),
      crudKeys.entity(agentCrudEntity),
      crudKeys.entity(folderCrudEntity),
    ],
  });
