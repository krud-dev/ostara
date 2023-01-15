import { ipcMain } from 'electron';
import { instanceService } from './instanceService';
import { instancePropertyService } from './instancePropertyService';

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

ipcMain.handle('instancePropertyService:getProperties', async (event, instanceId) => {
  return instancePropertyService.getProperties(instanceId);
});
