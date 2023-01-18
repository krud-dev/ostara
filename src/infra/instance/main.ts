import { ipcMain } from 'electron';
import { instanceService } from './instanceService';
import { instancePropertyService } from './instancePropertyService';
import { instanceHttpRequestStatisticsService } from './instanceHttpRequestStatisticsService';
import { instanceHeapdumpService } from './heapdump/instanceHeapdumpService';

ipcMain.handle('instanceService:fetchInstanceHealthById', async (event, id) => {
  return instanceService.fetchInstanceHealthById(id);
});

ipcMain.handle('instanceService:getInstanceLoggers', async (event, instanceId) => {
  return instanceService.getInstanceLoggers(instanceId);
});

ipcMain.handle('instanceService:getInstanceLogger', async (event, instanceId, loggerName) => {
  return instanceService.getInstanceLogger(instanceId, loggerName);
});

ipcMain.handle('instanceService:setInstanceLoggerLevel', async (event, instanceId, loggerName, level) => {
  return instanceService.setInstanceLoggerLevel(instanceId, loggerName, level);
});

ipcMain.handle('instanceService:getApplicationLoggers', async (event, applicationId) => {
  return instanceService.getApplicationLoggers(applicationId);
});

ipcMain.handle('instanceService:getApplicationLogger', async (event, applicationId, loggerName) => {
  return instanceService.getApplicationLogger(applicationId, loggerName);
});

ipcMain.handle('instanceService:setApplicationLoggerLevel', async (event, applicationId, loggerName, level) => {
  return instanceService.setApplicationLoggerLevel(applicationId, loggerName, level);
});

ipcMain.handle('instanceService:getInstanceCaches', async (event, instanceId) => {
  return instanceService.getInstanceCaches(instanceId);
});

ipcMain.handle('instanceService:getInstanceCache', async (event, instanceId, cacheName) => {
  return instanceService.getInstanceCache(instanceId, cacheName);
});

ipcMain.handle('instanceService:evictInstanceCaches', async (event, instanceId, cacheNames) => {
  return instanceService.evictInstanceCaches(instanceId, cacheNames);
});

ipcMain.handle('instanceService:evictAllInstanceCaches', async (event, instanceId) => {
  return instanceService.evictAllInstanceCaches(instanceId);
});

ipcMain.handle('instanceService:getInstanceCacheStatistics', async (event, instanceId, cacheName) => {
  return instanceService.getInstanceCacheStatistics(instanceId, cacheName);
});

ipcMain.handle('instanceService:getApplicationCaches', async (event, applicationId) => {
  return instanceService.getApplicationCaches(applicationId);
});

ipcMain.handle('instanceService:getApplicationCache', async (event, applicationId, cacheName) => {
  return instanceService.getApplicationCache(applicationId, cacheName);
});

ipcMain.handle('instanceService:evictApplicationCaches', async (event, applicationId, cacheNames) => {
  return instanceService.evictApplicationCaches(applicationId, cacheNames);
});

ipcMain.handle('instanceService:evictAllApplicationCaches', async (event, applicationId) => {
  return instanceService.evictAllApplicationCaches(applicationId);
});

ipcMain.handle('instanceService:getApplicationCacheStatistics', async (event, applicationId, cacheName) => {
  return instanceService.getApplicationCacheStatistics(applicationId, cacheName);
});

ipcMain.handle('instancePropertyService:getProperties', async (event, instanceId) => {
  return instancePropertyService.getProperties(instanceId);
});

ipcMain.handle('instanceHttpRequestStatisticsService:getStatistics', async (event, instanceId) => {
  return instanceHttpRequestStatisticsService.getStatistics(instanceId);
});

ipcMain.handle('instanceHttpRequestStatisticsService:getStatisticsForUri', async (event, instanceId, uri, options) => {
  return instanceHttpRequestStatisticsService.getStatisticsForUri(instanceId, uri, options);
});

ipcMain.handle('instanceHttpRequestStatisticsService:getStatisticsForUriByMethods', async (event, instanceId, uri) => {
  return instanceHttpRequestStatisticsService.getStatisticsForUriByMethods(instanceId, uri);
});

ipcMain.handle('instanceHttpRequestStatisticsService:getStatisticsForUriByStatuses', async (event, instanceId, uri) => {
  return instanceHttpRequestStatisticsService.getStatisticsForUriByStatuses(instanceId, uri);
});

ipcMain.handle('instanceHttpRequestStatisticsService:getStatisticsForUriByOutcomes', async (event, instanceId, uri) => {
  return instanceHttpRequestStatisticsService.getStatisticsForUriByOutcomes(instanceId, uri);
});

ipcMain.handle(
  'instanceHttpRequestStatisticsService:getStatisticsForUriByExceptions',
  async (event, instanceId, uri) => {
    return instanceHttpRequestStatisticsService.getStatisticsForUriByExceptions(instanceId, uri);
  }
);

ipcMain.handle('instanceHeapdumpService:getHeapdumps', async (event, instanceId, heapdumpId) => {
  return instanceHeapdumpService.getHeapdumps(instanceId);
});

ipcMain.handle('instanceHeapdumpService:requestDownloadHeapdump', async (event, instanceId) => {
  return instanceHeapdumpService.requestDownloadHeapdump(instanceId);
});

ipcMain.handle('instanceHeapdumpService:deleteHeapdump', async (event, instanceId, referenceId) => {
  return instanceHeapdumpService.deleteHeapdump(instanceId, referenceId);
});
