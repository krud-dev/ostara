import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { InstanceHealthRO } from '../../../common/generated_definitions';
import { axiosInstance } from '../axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {
  instanceId: string;
};

type Data = InstanceHealthRO;

export const fetchInstanceHealth = async (variables: Variables): Promise<Data> => {
  // TODO: update to use the new health endpoint
  return (
    await axiosInstance.get<Data, AxiosResponse<Data>>(
      `instance/${variables.instanceId}/${variables.instanceId}/health`
    )
  ).data;
};

export const useFetchInstanceHealth = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(fetchInstanceHealth, {
    ...options,
  });
