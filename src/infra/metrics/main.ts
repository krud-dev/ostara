import { ipcMain } from 'electron';
import { metricsService, MetricSubscription } from './metricsService';

ipcMain.handle('metricsService:getMetrics', async (event, instanceId, metricName, from, to) => {
  const metrics = await metricsService.getMetrics(instanceId, metricName, from, to);
  return metrics;
});

ipcMain.handle('metricsService:getLatestMetric', async (event, instanceId, metricName) => {
  const metrics = await metricsService.getLatestMetric(instanceId, metricName);
  return metrics;
});

const metricSubscriptions: { [key: string]: boolean } = {};

ipcMain.handle('metricsService:subscribeToMetric', async (event, instanceId, metricName, channelName) => {
  if (metricSubscriptions[channelName]) {
    throw new Error(`Channel name in use: ${channelName} for ${metricName} for instance ${instanceId}`);
  }
  metricSubscriptions[channelName] = true;
  const timer = setInterval(() => {
    if (metricSubscriptions[channelName]) {
      metricsService
        .getLatestMetric(instanceId, metricName)
        .then((metric) => event.sender.send(channelName, metric))
        .catch((error) => console.error(error));
    } else {
      clearInterval(timer);
    }
  }, 1000);
});

ipcMain.handle('metricsService:unsubscribeFromMetric', async (event, channelName) => {
  if (!metricSubscriptions[channelName]) {
    throw new Error(`Channel name not in use: ${channelName}`);
  }
  delete metricSubscriptions[channelName];
});
