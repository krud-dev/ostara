import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { ApplicationMetricDTO } from 'infra/metrics/metricsService';
import { IpcRendererEvent } from 'electron';

type Variables = {
  instanceId: string;
  metricName: string;
  listener: (event: IpcRendererEvent, metric: ApplicationMetricDTO) => void;
};

type Data = () => void;

export const subscribeToMetric = async (variables: Variables): Promise<Data> => {
  return await window.metrics.subscribeToMetric(variables.instanceId, variables.metricName, variables.listener);
};

export const useSubscribeToMetric = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(subscribeToMetric, options);
