import { ipcRenderer } from 'electron';

export const uiServiceBridge: UiServiceBridge = {
  getThemeSource(): Promise<'system' | 'light' | 'dark'> {
    return ipcRenderer.invoke('uiService:getThemeSource');
  },

  setThemeSource(themeSource: 'system' | 'light' | 'dark'): Promise<void> {
    return ipcRenderer.invoke('uiService:setThemeSource', themeSource);
  },
};
