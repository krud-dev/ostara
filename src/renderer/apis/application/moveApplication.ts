import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { axiosInstance } from '../axiosInstance';
import { AxiosResponse } from 'axios';
import { ApplicationRO } from '../../../common/generated_definitions';
import { crudKeys } from '../crud/crudKeys';
import { applicationCrudEntity } from '../crud/entity/entities/application.crud-entity';

type Variables = {
  applicationId: string;
  newParentFolderId?: string;
  newSort: number;
};

type Data = ApplicationRO;

export const moveApplication = async (variables: Variables): Promise<Data> => {
  const { applicationId, newParentFolderId, newSort } = variables;

  const result = await axiosInstance.post<Data, AxiosResponse<Data>, null>(
    `${applicationCrudEntity.path}/${applicationId}/move`,
    null,
    { params: { newParentFolderId, newSort } }
  );
  return result.data;
};

export const useMoveApplication = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(moveApplication, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => crudKeys.entity(applicationCrudEntity),
  });
