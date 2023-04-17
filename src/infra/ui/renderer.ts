import { ipcRenderer } from 'electron';
import { ElectronTheme, ThemeSource } from './models/electronTheme';
import { isLinux, isMac, isWindows } from '../utils/platform';
import electronDl from 'electron-dl';

export const uiServiceBridge: UiServiceBridge = {
  getTheme(): Promise<ElectronTheme> {
    return ipcRenderer.invoke('uiService:getTheme');
  },
  getThemeSource(): Promise<ThemeSource> {
    return ipcRenderer.invoke('uiService:getThemeSource');
  },

  setThemeSource(themeSource: ThemeSource): Promise<void> {
    return ipcRenderer.invoke('uiService:setThemeSource', themeSource);
  },

  minimizeWindow(): Promise<void> {
    return ipcRenderer.invoke('uiService:minimizeWindow');
  },
  maximizeWindow(): Promise<void> {
    return ipcRenderer.invoke('uiService:maximizeWindow');
  },
  closeWindow(): Promise<void> {
    return ipcRenderer.invoke('uiService:closeWindow');
  },

  restartApp(): Promise<void> {
    return ipcRenderer.invoke('uiService:restartApp');
  },

  downloadFile(url: string, options?: electronDl.Options): Promise<void> {
    return ipcRenderer.invoke('uiService:downloadFile', url, options);
  },

  getAppVersion(): Promise<string> {
    return ipcRenderer.invoke('uiService:getAppVersion');
  },

  isMac: isMac,
  isWindows: isWindows,
  isLinux: isLinux,
};
