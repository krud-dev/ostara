import { ipcRenderer, IpcRendererEvent } from 'electron';
import { ApplicationMetricDTO } from './metricsService';
import { utilsBridge } from '../rendererUtils/renderer';

export const metricsServiceBridge: MetricsServiceBridge = {
  async getMetrics(instanceId: string, metricName: string, from: Date, to: Date) {
    return ipcRenderer.invoke('metricsService:getMetrics', instanceId, metricName, from, to);
  },
  async getLatestMetric(instanceId: string, metricName: string) {
    return ipcRenderer.invoke('metricsService:getLatestMetric', instanceId, metricName);
  },
  async subscribeToMetric(
    instanceId: string,
    metricName: string,
    listener: (event: IpcRendererEvent, metric: ApplicationMetricDTO) => void
  ) {
    const channelName = `metricsService:metricUpdated:${instanceId}:${metricName}:${await utilsBridge.uuidv4()}`;
    console.log('Subscribing to metric', instanceId, metricName, channelName);
    ipcRenderer.on(channelName, listener);
    await ipcRenderer.invoke('metricsService:subscribeToMetric', instanceId, metricName, channelName);
    return () => {
      ipcRenderer
        .invoke('metricsService:unsubscribeFromMetric', channelName)
        .then(() => {
          console.log('Unsubscribing from metric', instanceId, metricName, channelName);
          return ipcRenderer.removeListener(channelName, listener);
        })
        .catch((error) => console.error(error));
    };
  },
};
