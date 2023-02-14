import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { axiosInstance } from '../axiosInstance';
import { AxiosResponse } from 'axios/index';

type Variables = {
  applicationId: string;
  cacheNames: string[];
};

type Data = void;

export const evictApplicationCaches = async (variables: Variables): Promise<Data> => {
  // TODO: evict by cache name
  return (await axiosInstance.delete<Data, AxiosResponse<Data>>(`cache/application/${variables.applicationId}`)).data;
};

export const useEvictApplicationCaches = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(evictApplicationCaches, {
    ...options,
  });
