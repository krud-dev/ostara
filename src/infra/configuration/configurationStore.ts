import ElectronStore from 'electron-store';
import { ipcMain } from 'electron';

const configurationStore = new ElectronStore();

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

export default configurationStore;
