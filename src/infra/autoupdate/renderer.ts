import { ipcRenderer } from 'electron';

export const appUpdaterBridge: AppUpdaterBridge = {
  checkForUpdates: () => ipcRenderer.invoke('appUpdater:checkForUpdates'),
  downloadUpdate: () => ipcRenderer.send('appUpdater:downloadUpdate'),
  quitAndInstall: () => ipcRenderer.send('appUpdater:quitAndInstall'),
};
