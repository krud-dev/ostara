import { ipcMain } from 'electron';
import { configurationStore } from './configurationStore';
import { ConfigurationService } from './configurationService';

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
  return ConfigurationService.getConfiguration();
});

ipcMain.handle('configurationService:getItem', async (event, id) => {
  return ConfigurationService.getItem(id);
});

ipcMain.handle('configurationService:getItemOrThrow', async (event, id) => {
  return ConfigurationService.getItemOrThrow(id);
});

ipcMain.handle('configurationService:itemExistsOrThrow', async (event, id) => {
  return ConfigurationService.itemExistsOrThrow(id);
});

ipcMain.handle('configurationService:reorderItem', async (event, id, order) => {
  return ConfigurationService.reorderItem(id, order);
});

/**
 * Folder operations
 */

ipcMain.handle('configurationService:createFolder', async (event, folder) => {
  return ConfigurationService.createFolder(folder);
});

ipcMain.handle('configurationService:updateFolder', async (event, id, folder) => {
  return ConfigurationService.updateFolder(id, folder);
});

ipcMain.handle('configurationService:deleteFolder', async (event, id) => {
  return ConfigurationService.deleteFolder(id);
});

ipcMain.handle('configurationService:getFolderChildren', async (event, id) => {
  return ConfigurationService.getFolderChildren(id);
});

ipcMain.handle('configurationService:moveFolder', async (event, id, parentUuid) => {
  return ConfigurationService.moveFolder(id, parentUuid);
});

/**
 * Application operations
 */

ipcMain.handle('configurationService:createApplication', async (event, application) => {
  return ConfigurationService.createApplication(application);
});

ipcMain.handle('configurationService:updateApplication', async (event, id, application) => {
  return ConfigurationService.updateApplication(id, application);
});

ipcMain.handle('configurationService:deleteApplication', async (event, id) => {
  return ConfigurationService.deleteApplication(id);
});

ipcMain.handle('configurationService:moveApplication', async (event, id, parentUuid) => {
  return ConfigurationService.moveApplication(id, parentUuid);
});

ipcMain.handle('configurationService:getApplicationInstances', async (event, id) => {
  return ConfigurationService.getApplicationInstances(id);
});

/**
 * Instance operations
 */

ipcMain.handle('configurationService:createInstance', async (event, instance) => {
  return ConfigurationService.createInstance(instance);
});

ipcMain.handle('configurationService:updateInstance', async (event, id, instance) => {
  return ConfigurationService.updateInstance(id, instance);
});

ipcMain.handle('configurationService:deleteInstance', async (event, id) => {
  return ConfigurationService.deleteInstance(id);
});

ipcMain.handle('configurationService:moveInstance', async (event, id, parentUuid) => {
  return ConfigurationService.moveInstance(id, parentUuid);
});
