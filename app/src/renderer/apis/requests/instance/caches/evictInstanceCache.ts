import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';
import { EvictCachesRequestRO } from '../../../../../common/generated_definitions';

type Variables = {
  instanceId: string;
  cacheName: string;
};

type Data = void;

export const evictInstanceCache = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.delete<Data, AxiosResponse<Data>, EvictCachesRequestRO>(
      `cache/instance/${variables.instanceId}/${variables.cacheName}`
    )
  ).data;
};

export const useEvictInstanceCache = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(evictInstanceCache, {
    ...options,
  });
