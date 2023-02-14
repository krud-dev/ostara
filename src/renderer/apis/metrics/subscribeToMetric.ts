import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { IpcRendererEvent } from 'electron';
import { InstanceMetricRO } from '../../../common/generated_definitions';

type Variables = {
  instanceId: string;
  metricName: string;
  listener: (event: IpcRendererEvent, metric: InstanceMetricRO) => void;
};

type Data = () => void;

export const subscribeToMetric = async (variables: Variables): Promise<Data> => {
  // TODO: implement subscribe logic
  return () => {};
};

export const useSubscribeToMetric = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(subscribeToMetric, options);
