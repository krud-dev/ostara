import { ApplicationMetricDTO } from './metricsService';

declare global {
  type MetricsServiceBridge = {
    getMetrics: (instanceId: string, metricName: string, from: Date, to: Date) => Promise<ApplicationMetricDTO>;
    getLatestMetric: (instanceId: string, metricName: string) => Promise<ApplicationMetricDTO>;
  };

  interface Window {
    metrics: MetricsServiceBridge;
  }
}
