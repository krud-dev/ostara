import { ipcMain } from 'electron';
import { metricsService } from './metricsService';
import { configurationService } from '../configuration/configurationService';

ipcMain.handle('metricsService:getLatestMetric', async (event, instanceId, metricName) => {
  const metrics = await metricsService.getLatestMetric(instanceId, metricName);
  return metrics;
});

const metricSubscriptions: { [key: string]: boolean } = {};

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
  metricSubscriptions[channelName] = true;
  try {
    callback();
  } catch (error) {
    // Instance may be unhealthy, just skip to allow the subscription to be created
  }
  const timer = setInterval(() => {
    if (metricSubscriptions[channelName]) {
      callback();
    } else {
      clearInterval(timer);
    }
  }, instance.dataCollectionIntervalSeconds * 1000);
});

ipcMain.handle('metricsService:unsubscribeFromMetric', async (event, channelName) => {
  if (!metricSubscriptions[channelName]) {
    throw new Error(`Channel name not in use: ${channelName}`);
  }
  delete metricSubscriptions[channelName];
});
