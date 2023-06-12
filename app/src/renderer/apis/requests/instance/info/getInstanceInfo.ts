import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from 'renderer/apis/requests/base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { axiosInstance } from 'renderer/apis/axiosInstance';
import { AxiosResponse } from 'axios';
import { InfoActuatorResponse } from 'common/generated_definitions';

type Variables = {
  instanceId: string;
};

type Data = InfoActuatorResponse;

export const getInstanceInfo = async (variables: Variables): Promise<Data> => {
  return (await axiosInstance.get<Data, AxiosResponse<Data>>(`actuator/info?instanceId=${variables.instanceId}`)).data;
};

export const useGetInstanceInfo = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceInfo, options);

export const useGetInstanceInfoQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemInfo(variables.instanceId), getInstanceInfo, variables, options);
