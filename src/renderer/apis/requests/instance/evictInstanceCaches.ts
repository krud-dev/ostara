import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/requests/base/useBaseMutation';
import { axiosInstance } from '../../axiosInstance';
import { AxiosResponse } from 'axios';
import { EvictCachesRequestRO } from '../../../../common/generated_definitions';

type Variables = {
  instanceId: string;
  cacheNames: string[];
};

type Data = void;

export const evictInstanceCaches = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.delete<Data, AxiosResponse<Data>, EvictCachesRequestRO>(
      `cache/instance/${variables.instanceId}/bulk`,
      { data: { cacheNames: variables.cacheNames } }
    )
  ).data;
};

export const useEvictInstanceCaches = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(evictInstanceCaches, {
    ...options,
  });
