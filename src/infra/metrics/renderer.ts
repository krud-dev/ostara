import { ipcRenderer } from 'electron';

export const metricsServiceBridge: MetricsServiceBridge = {
  async getMetrics(instanceId: string, metricName: string, from: Date, to: Date) {
    return ipcRenderer.invoke('metricsService:getMetrics', instanceId, metricName, from, to);
  },
  async getLatestMetric(instanceId: string, metricName: string) {
    return ipcRenderer.invoke('metricsService:getLatestMetric', instanceId, metricName);
  },
};
