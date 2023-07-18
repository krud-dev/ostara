import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { AxiosResponse } from 'axios';
import { axiosInstance } from 'renderer/apis/axiosInstance';
import { crudKeys } from 'renderer/apis/requests/crud/crudKeys';
import { instanceCrudEntity } from 'renderer/apis/requests/crud/entity/entities/instance.crudEntity';
import { applicationCrudEntity } from 'renderer/apis/requests/crud/entity/entities/application.crudEntity';
import { folderCrudEntity } from 'renderer/apis/requests/crud/entity/entities/folder.crudEntity';
import { agentCrudEntity } from 'renderer/apis/requests/crud/entity/entities/agent.crudEntity';

type Variables = {
  fileName: string;
};

type Data = void;

export const restoreSystemBackup = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.post<Data, AxiosResponse<Data>, null>(`systemBackup/restore`, null, {
      params: {
        fileName: variables.fileName,
      },
    })
  ).data;
};

export const useRestoreSystemBackup = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(restoreSystemBackup, {
    ...options,
    invalidateQueriesKeysFn: (data, variables) => [
      crudKeys.entity(instanceCrudEntity),
      crudKeys.entity(applicationCrudEntity),
      crudKeys.entity(agentCrudEntity),
      crudKeys.entity(folderCrudEntity),
    ],
  });
