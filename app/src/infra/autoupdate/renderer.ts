import { ipcRenderer } from 'electron';

export const appUpdaterBridge: AppUpdaterBridge = {
  checkForUpdates: () => ipcRenderer.invoke('appUpdater:checkForUpdates'),
  downloadUpdate: () => ipcRenderer.invoke('appUpdater:downloadUpdate'),
  quitAndInstall: () => ipcRenderer.send('appUpdater:quitAndInstall'),
};
