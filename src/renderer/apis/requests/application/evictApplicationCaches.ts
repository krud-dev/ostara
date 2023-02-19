import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/requests/base/useBaseMutation';
import { axiosInstance } from '../../axiosInstance';
import { AxiosResponse } from 'axios';
import { EvictCachesRequestRO } from '../../../../common/generated_definitions';

type Variables = {
  applicationId: string;
  cacheNames: string[];
};

type Data = void;

export const evictApplicationCaches = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.delete<Data, AxiosResponse<Data>, EvictCachesRequestRO>(
      `cache/application/${variables.applicationId}/bulk`,
      { data: { cacheNames: variables.cacheNames } }
    )
  ).data;
};

export const useEvictApplicationCaches = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(evictApplicationCaches, {
    ...options,
  });
