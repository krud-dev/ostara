import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { MetricsActuatorResponse } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';

export type EnrichedInstanceMetric = { name: string; instanceId: string };

type Variables = {
  instanceId: string;
};

type Data = EnrichedInstanceMetric[];

export const getInstanceMetrics = async (variables: Variables): Promise<Data> => {
  const result = (
    await axiosInstance.get<MetricsActuatorResponse, AxiosResponse<MetricsActuatorResponse>>(
      `actuator/metrics?instanceId=${variables.instanceId}`
    )
  ).data;
  return result.names.map((name) => ({ name, instanceId: variables.instanceId }));
};

export const useGetInstanceMetrics = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceMetrics, options);

export const useGetInstanceMetricsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemMetrics(variables.instanceId), getInstanceMetrics, variables, options);
