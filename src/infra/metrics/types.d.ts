import { ApplicationMetricDTO } from './metricsService';
import { IpcRendererEvent } from 'electron';

declare global {
  type MetricsServiceBridge = {
    getMetrics: (
      instanceId: string,
      metricName: string,
      from: Date,
      to: Date
    ) => Promise<ApplicationMetricDTO | undefined>;
    getLatestMetric: (instanceId: string, metricName: string) => Promise<ApplicationMetricDTO | undefined>;
    subscribeToMetric: (
      instanceId: string,
      metricName: string,
      listener: (event: IpcRendererEvent, metric: ApplicationMetricDTO) => void
    ) => Promise<() => void>;
  };

  interface Window {
    metrics: MetricsServiceBridge;
  }
}
