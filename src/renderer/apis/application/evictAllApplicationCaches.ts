import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { axiosInstance } from '../axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {
  applicationId: string;
};

type Data = void;

export const evictAllApplicationCaches = async (variables: Variables): Promise<Data> => {
  return (await axiosInstance.delete<Data, AxiosResponse<Data>>(`cache/application/${variables.applicationId}`)).data;
};

export const useEvictAllApplicationCaches = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(evictAllApplicationCaches, {
    ...options,
  });
