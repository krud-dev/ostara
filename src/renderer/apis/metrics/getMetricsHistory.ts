import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { ApplicationMetricDTO } from 'infra/metrics/metricsService';
import { metricsKeys } from 'renderer/apis/metrics/metricsKeys';

type Variables = {
  instanceId: string;
  metricName: string;
  from: Date;
  to: Date;
};

type Data = ApplicationMetricDTO;

export const getMetricsHistory = async (variables: Variables): Promise<Data> => {
  return await window.metrics.getMetrics(variables.instanceId, variables.metricName, variables.from, variables.to);
};

export const useGetMetricsHistory = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getMetricsHistory, options);

export const useGetMetricsHistoryQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    metricsKeys.history(variables.instanceId, variables.metricName, variables.from, variables.to),
    getMetricsHistory,
    variables,
    options
  );
