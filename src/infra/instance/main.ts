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
