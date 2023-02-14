import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { axiosInstance } from '../axiosInstance';
import { InstanceMetricRO } from '../../../common/generated_definitions';
import { AxiosResponse } from 'axios';

type Variables = {
  instanceId: string;
  metricName: string;
};

type Data = InstanceMetricRO;

export const getLatestMetric = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.get<Data, AxiosResponse<Data>>(
      `instances/${variables.instanceId}/metrics/latest?metricName=${encodeURIComponent(variables.metricName)}`
    )
  ).data;
};

export const useGetLatestMetric = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getLatestMetric, options);

export const useGetLatestMetricQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.metricLatest(variables.instanceId, variables.metricName),
    getLatestMetric,
    variables,
    options
  );
