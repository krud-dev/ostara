import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { InstanceHttpRequestStatisticsRO } from '../../../common/generated_definitions';
import { axiosInstance } from '../axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {
  instanceId: string;
};

type Data = InstanceHttpRequestStatisticsRO[];

export const getInstanceHttpRequestStatistics = async (variables: Variables): Promise<Data> => {
  return (await axiosInstance.get<Data, AxiosResponse<Data>>(`instances/${variables.instanceId}/httpRequestStatistics`))
    .data;
};

export const useGetInstanceHttpRequestStatistics = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getInstanceHttpRequestStatistics, options);

export const useGetInstanceHttpRequestStatisticsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemHttpRequestStatistics(variables.instanceId),
    getInstanceHttpRequestStatistics,
    variables,
    options
  );
