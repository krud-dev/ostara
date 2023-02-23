import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';
import { EvictCachesRequestRO, InstanceHeapdumpReferenceRO } from '../../../../../common/generated_definitions';
import { apiKeys } from '../../../apiKeys';
import { heapdumpReferenceCrudEntity } from '../../crud/entity/entities/heapdumpReference.crudEntity';

type Variables = {
  instanceId: string;
};

type Data = InstanceHeapdumpReferenceRO;

export const requestInstanceHeapdump = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.post<Data, AxiosResponse<Data>>(`${heapdumpReferenceCrudEntity.path}/${variables.instanceId}`)
  ).data;
};

export const useRequestInstanceHeapdump = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(requestInstanceHeapdump, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.itemHeapdumps(variables.instanceId),
  });
