import { ipcMain } from 'electron';
import { metricsService } from './metricsService';

ipcMain.handle('metricsService:getMetrics', async (event, instanceId, metricName, from, to) => {
  const metrics = await metricsService.getMetrics(instanceId, metricName, from, to);
  return metrics;
});

ipcMain.handle('metricsService:getLatestMetric', async (event, instanceId, metricName) => {
  const metrics = await metricsService.getLatestMetric(instanceId, metricName);
  return metrics;
});
