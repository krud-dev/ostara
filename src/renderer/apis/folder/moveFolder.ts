import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { axiosInstance } from '../axiosInstance';
import { AxiosResponse } from 'axios';
import { FolderRO } from '../../../common/generated_definitions';
import { folderCrudEntity } from '../crud/entity/entities/folder.crud-entity';
import { crudKeys } from '../crud/crudKeys';

type Variables = {
  folderId: string;
  newParentFolderId?: string;
  newSort: number;
};

type Data = FolderRO;

export const moveFolder = async (variables: Variables): Promise<Data> => {
  const { folderId, newParentFolderId, newSort } = variables;

  const result = await axiosInstance.post<Data, AxiosResponse<Data>, null>(
    `${folderCrudEntity.path}/${folderId}/move`,
    null,
    { params: { newParentFolderId, newSort } }
  );
  return result.data;
};

export const useMoveFolder = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(moveFolder, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => crudKeys.entity(folderCrudEntity),
  });
