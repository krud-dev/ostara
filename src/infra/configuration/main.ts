import { ipcMain } from 'electron';
import { configurationStore } from './configurationStore';
import { configurationService } from './configurationService';

ipcMain.on('configurationStore:get', async (event, val) => {
  event.returnValue = configurationStore.get(val);
});
ipcMain.on('configurationStore:set', async (event, key, val) => {
  configurationStore.set(key, val);
});

ipcMain.on('configurationStore:has', async (event, val) => {
  event.returnValue = configurationStore.has(val);
});

ipcMain.on('configurationStore:delete', async (event, val) => {
  configurationStore.delete(val);
});

ipcMain.on('configurationStore:reset', async (event, val) => {
  configurationStore.reset(val);
});

ipcMain.on('configurationStore:clear', async () => {
  configurationStore.clear();
});

/**
 * Configuration service
 */

/**
 * Generic operations
 */
ipcMain.handle('configurationService:getConfiguration', async () => {
  return configurationService.getConfiguration();
});

ipcMain.handle('configurationService:getItem', async (event, id) => {
  return configurationService.getItem(id);
});

ipcMain.handle('configurationService:getItemOrThrow', async (event, id) => {
  return configurationService.getItemOrThrow(id);
});

ipcMain.handle('configurationService:itemExistsOrThrow', async (event, id) => {
  return configurationService.itemExistsOrThrow(id);
});

ipcMain.handle('configurationService:reorderItem', async (event, id, order) => {
  return configurationService.reorderItem(id, order);
});

ipcMain.handle('configurationService:setColor', async (event, id, color) => {
  return configurationService.setColor(id, color);
});

/**
 * Folder operations
 */

ipcMain.handle('configurationService:createFolder', async (event, folder) => {
  return configurationService.createFolder(folder);
});

ipcMain.handle('configurationService:updateFolder', async (event, id, folder) => {
  return configurationService.updateFolder(id, folder);
});

ipcMain.handle('configurationService:deleteFolder', async (event, id) => {
  return configurationService.deleteFolder(id);
});

ipcMain.handle('configurationService:getFolderChildren', async (event, id) => {
  return configurationService.getFolderChildren(id);
});

ipcMain.handle('configurationService:moveFolder', async (event, id, parentUuid) => {
  return configurationService.moveFolder(id, parentUuid);
});

/**
 * Application operations
 */

ipcMain.handle('configurationService:createApplication', async (event, application) => {
  return configurationService.createApplication(application);
});

ipcMain.handle('configurationService:updateApplication', async (event, id, application) => {
  return configurationService.updateApplication(id, application);
});

ipcMain.handle('configurationService:deleteApplication', async (event, id) => {
  return configurationService.deleteApplication(id);
});

ipcMain.handle('configurationService:moveApplication', async (event, id, parentUuid) => {
  return configurationService.moveApplication(id, parentUuid);
});

ipcMain.handle('configurationService:getApplicationInstances', async (event, id) => {
  return configurationService.getApplicationInstances(id);
});

/**
 * Instance operations
 */

ipcMain.handle('configurationService:createInstance', async (event, instance) => {
  return configurationService.createInstance(instance);
});

ipcMain.handle('configurationService:updateInstance', async (event, id, instance) => {
  return configurationService.updateInstance(id, instance);
});

ipcMain.handle('configurationService:deleteInstance', async (event, id) => {
  return configurationService.deleteInstance(id);
});

ipcMain.handle('configurationService:moveInstance', async (event, id, parentUuid) => {
  return configurationService.moveInstance(id, parentUuid);
});
