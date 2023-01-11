import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { ApplicationMetricDTO } from 'infra/metrics/metricsService';
import { apiKeys } from 'renderer/apis/apiKeys';

type Variables = {
  instanceId: string;
  metricName: string;
};

type Data = ApplicationMetricDTO | undefined;

export const getLatestMetric = async (variables: Variables): Promise<Data> => {
  return await window.metrics.getLatestMetric(variables.instanceId, variables.metricName);
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
