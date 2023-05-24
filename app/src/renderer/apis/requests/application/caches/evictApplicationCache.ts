import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';
import { EvictCachesRequestRO } from '../../../../../common/generated_definitions';

type Variables = {
  applicationId: string;
  cacheName: string;
};

type Data = void;

export const evictApplicationCache = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.delete<Data, AxiosResponse<Data>, EvictCachesRequestRO>(
      `cache/application/${variables.applicationId}/${variables.cacheName}`
    )
  ).data;
};

export const useEvictApplicationCache = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(evictApplicationCache, {
    ...options,
  });
