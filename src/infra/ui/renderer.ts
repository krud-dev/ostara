import { ipcRenderer } from 'electron';
import { ElectronTheme } from './models/electronTheme';

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
};
