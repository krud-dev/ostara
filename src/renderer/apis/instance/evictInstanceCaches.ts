import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { axiosInstance } from '../axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {
  instanceId: string;
  cacheNames: string[];
};

type Data = void;

export const evictInstanceCaches = async (variables: Variables): Promise<Data> => {
  // TODO: evict by cache name
  return (await axiosInstance.delete<Data, AxiosResponse<Data>>(`cache/instance/${variables.instanceId}`)).data;
};

export const useEvictInstanceCaches = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(evictInstanceCaches, {
    ...options,
  });
