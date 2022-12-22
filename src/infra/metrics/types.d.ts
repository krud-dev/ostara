import { ApplicationMetricDTO } from './metricsService';
import { IpcRendererEvent } from 'electron';

declare global {
  type MetricsServiceBridge = {
    getMetrics: (instanceId: string, metricName: string, from: Date, to: Date) => Promise<ApplicationMetricDTO>;
    getLatestMetric: (instanceId: string, metricName: string) => Promise<ApplicationMetricDTO>;
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
