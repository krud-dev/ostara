import { ipcMain } from 'electron';
import { metricsService } from './metricsService';
import { configurationService } from '../configuration/configurationService';
import { systemEvents } from '../events';

ipcMain.handle('metricsService:getLatestMetric', async (event, instanceId, metricName) => {
  const metrics = await metricsService.getLatestMetric(instanceId, metricName);
  return metrics;
});

const metricSubscriptions: { [key: string]: NodeJS.Timer } = {};

ipcMain.handle('metricsService:subscribeToMetric', async (event, instanceId, metricName, channelName) => {
  if (metricSubscriptions[channelName]) {
    throw new Error(`Channel name in use: ${channelName} for ${metricName} for instance ${instanceId}`);
  }
  const instance = configurationService.getInstanceOrThrow(instanceId);
  const callback = () => {
    metricsService
      .getLatestMetric(instanceId, metricName)
      .then((metric) => event.sender.send(channelName, metric))
      .catch((error) => console.error(error));
  };
  try {
    callback();
  } catch (error) {
    // Instance may be unhealthy, just skip to allow the subscription to be created
  }
  metricSubscriptions[channelName] = setInterval(callback, (instance.dataCollectionIntervalSeconds ?? 60) * 1000);
});

ipcMain.handle('metricsService:unsubscribeFromMetric', async (event, channelName) => {
  if (metricSubscriptions[channelName]) {
    clearInterval(metricSubscriptions[channelName]);
    delete metricSubscriptions[channelName];
  }
});

systemEvents.on('instance-deleted', (instance) => {
  Object.keys(metricSubscriptions).forEach((channelName) => {
    if (channelName.startsWith(instance.id)) {
      clearInterval(metricSubscriptions[channelName]);
      delete metricSubscriptions[channelName];
    }
  });
});
