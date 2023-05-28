import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';
import { heapdumpReferenceCrudEntity } from '../../crud/entity/entities/heapdumpReference.crudEntity';
import { apiKeys } from '../../../apiKeys';
import { crudKeys } from '../../crud/crudKeys';
import { crudDelete } from '../../crud/crudDelete';

type Variables = {
  instanceId: string;
  referenceId: string;
};

type Data = void;

export const deleteInstanceHeapdumpReference = async (variables: Variables): Promise<Data> => {
  return await crudDelete({ entity: heapdumpReferenceCrudEntity, id: variables.referenceId });
};

export const useDeleteInstanceHeapdumpReference = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(deleteInstanceHeapdumpReference, {
    ...options,
    invalidateQueriesKeysFn: (data, variables) => [
      apiKeys.itemHeapdumps(variables.instanceId),
      crudKeys.entity(heapdumpReferenceCrudEntity),
    ],
  });
