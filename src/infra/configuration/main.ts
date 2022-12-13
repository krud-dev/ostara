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

ipcMain.handle('configurationService:getItem', async (event, uuid) => {
  return ConfigurationService.getItem(uuid);
});

ipcMain.handle('configurationService:getItemOrThrow', async (event, uuid) => {
  return ConfigurationService.getItemOrThrow(uuid);
});

ipcMain.handle(
  'configurationService:itemExistsOrThrow',
  async (event, uuid) => {
    return ConfigurationService.itemExistsOrThrow(uuid);
  }
);

ipcMain.handle(
  'configurationService:reorderItem',
  async (event, uuid, order) => {
    return ConfigurationService.reorderItem(uuid, order);
  }
);

/**
 * Folder operations
 */

ipcMain.handle('configurationService:createFolder', async (event, folder) => {
  return ConfigurationService.createFolder(folder);
});

ipcMain.handle(
  'configurationService:updateFolder',
  async (event, uuid, folder) => {
    return ConfigurationService.updateFolder(uuid, folder);
  }
);

ipcMain.handle('configurationService:deleteFolder', async (event, uuid) => {
  return ConfigurationService.deleteFolder(uuid);
});

ipcMain.handle(
  'configurationService:getFolderChildren',
  async (event, uuid) => {
    return ConfigurationService.getFolderChildren(uuid);
  }
);

ipcMain.handle(
  'configurationService:moveFolder',
  async (event, uuid, parentUuid) => {
    return ConfigurationService.moveFolder(uuid, parentUuid);
  }
);

/**
 * Application operations
 */

ipcMain.handle(
  'configurationService:createApplication',
  async (event, application) => {
    return ConfigurationService.createApplication(application);
  }
);

ipcMain.handle(
  'configurationService:updateApplication',
  async (event, uuid, application) => {
    return ConfigurationService.updateApplication(uuid, application);
  }
);

ipcMain.handle(
  'configurationService:deleteApplication',
  async (event, uuid) => {
    return ConfigurationService.deleteApplication(uuid);
  }
);

ipcMain.handle(
  'configurationService:moveApplication',
  async (event, uuid, parentUuid) => {
    return ConfigurationService.moveApplication(uuid, parentUuid);
  }
);

ipcMain.handle(
  'configurationService:getApplicationInstances',
  async (event, uuid) => {
    return ConfigurationService.getApplicationInstances(uuid);
  }
);

/**
 * Instance operations
 */

ipcMain.handle(
  'configurationService:createInstance',
  async (event, instance) => {
    return ConfigurationService.createInstance(instance);
  }
);

ipcMain.handle(
  'configurationService:updateInstance',
  async (event, uuid, instance) => {
    return ConfigurationService.updateInstance(uuid, instance);
  }
);

ipcMain.handle('configurationService:deleteInstance', async (event, uuid) => {
  return ConfigurationService.deleteInstance(uuid);
});

ipcMain.handle(
  'configurationService:moveInstance',
  async (event, uuid, parentUuid) => {
    return ConfigurationService.moveInstance(uuid, parentUuid);
  }
);
