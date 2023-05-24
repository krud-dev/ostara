import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';
import { heapdumpReferenceCrudEntity } from '../../crud/entity/entities/heapdumpReference.crudEntity';
import { apiKeys } from '../../../apiKeys';

type Variables = {
  instanceId: string;
  referenceId: string;
};

type Data = void;

export const deleteInstanceHeapdumpReference = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.delete<Data, AxiosResponse<Data>>(
      `${heapdumpReferenceCrudEntity.path}/${variables.referenceId}`
    )
  ).data;
};

export const useDeleteInstanceHeapdumpReference = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(deleteInstanceHeapdumpReference, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.itemHeapdumps(variables.instanceId),
  });
