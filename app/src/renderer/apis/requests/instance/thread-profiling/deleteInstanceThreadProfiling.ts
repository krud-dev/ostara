import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from '../../../apiKeys';
import { threadProfilingRequestCrudEntity } from '../../crud/entity/entities/threadProfilingRequest.crudEntity';
import { crudDelete } from '../../crud/crudDelete';

type Variables = {
  instanceId: string;
  requestId: string;
};

type Data = void;

export const deleteInstanceThreadProfiling = async (variables: Variables): Promise<Data> => {
  return await crudDelete({
    entity: threadProfilingRequestCrudEntity,
    id: variables.requestId,
  });
};

export const useDeleteInstanceThreadProfiling = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(deleteInstanceThreadProfiling, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.itemThreadProfilingRequests(variables.instanceId),
  });
