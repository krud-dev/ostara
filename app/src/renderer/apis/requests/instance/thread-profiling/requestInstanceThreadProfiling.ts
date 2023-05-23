import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { ThreadProfilingRequestCreateRO, ThreadProfilingRequestRO } from '../../../../../common/generated_definitions';
import { apiKeys } from '../../../apiKeys';
import { crudCreate } from '../../crud/crudCreate';
import { threadProfilingRequestCrudEntity } from '../../crud/entity/entities/threadProfilingRequest.crudEntity';

type Variables = {
  request: ThreadProfilingRequestCreateRO;
};

type Data = ThreadProfilingRequestRO;

export const requestInstanceThreadProfiling = async (variables: Variables): Promise<Data> => {
  return await crudCreate<ThreadProfilingRequestRO, ThreadProfilingRequestCreateRO>({
    entity: threadProfilingRequestCrudEntity,
    item: variables.request,
  });
};

export const useRequestInstanceThreadProfiling = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(requestInstanceThreadProfiling, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.itemThreadProfilingRequests(variables.request.instanceId),
  });
