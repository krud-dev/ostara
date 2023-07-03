import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { axiosInstance } from '../../axiosInstance';
import { AxiosResponse } from 'axios';
import { FolderRO } from 'common/generated_definitions';
import { crudKeys } from '../crud/crudKeys';
import { agentCrudEntity } from 'renderer/apis/requests/crud/entity/entities/agent.crudEntity';

type Variables = {
  agentId: string;
  newParentFolderId?: string;
  newSort: number;
};

type Data = FolderRO;

export const moveAgent = async (variables: Variables): Promise<Data> => {
  const { agentId, newParentFolderId, newSort } = variables;

  const result = await axiosInstance.post<Data, AxiosResponse<Data>, null>(
    `${agentCrudEntity.path}/${agentId}/move`,
    null,
    { params: { newParentFolderId, newSort } }
  );
  return result.data;
};

export const useMoveAgent = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(moveAgent, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => crudKeys.entity(agentCrudEntity),
  });
