import { ipcMain } from 'electron';
import { instanceService } from './instanceService';

ipcMain.handle('instanceService:fetchInstanceHealthById', async (event, id) => {
  return instanceService.fetchInstanceHealthById(id);
});

ipcMain.handle('instanceService:getInstanceCaches', async (event, instanceId) => {
  return instanceService.getInstanceCaches(instanceId);
});

ipcMain.handle('instanceService:getInstanceCache', async (event, instanceId, cacheName) => {
  return instanceService.getInstanceCache(instanceId, cacheName);
});

ipcMain.handle('instanceService:evictInstanceCache', async (event, instanceId, cacheName) => {
  return instanceService.evictInstanceCache(instanceId, cacheName);
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
