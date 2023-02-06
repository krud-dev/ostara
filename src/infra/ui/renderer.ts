import { ipcRenderer } from 'electron';
import { ElectronTheme } from './models/electronTheme';
import { isLinux, isMac, isWindows } from '../utils/platform';

export const uiServiceBridge: UiServiceBridge = {
  getTheme(): Promise<ElectronTheme> {
    return ipcRenderer.invoke('uiService:getTheme');
  },
  getThemeSource(): Promise<'system' | 'light' | 'dark'> {
    return ipcRenderer.invoke('uiService:getThemeSource');
  },

  setThemeSource(themeSource: 'system' | 'light' | 'dark'): Promise<void> {
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

  isMac: isMac,
  isWindows: isWindows,
  isLinux: isLinux,
};
