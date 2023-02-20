import { ElectronTheme, ThemeSource } from './models/electronTheme';
import electronDl from 'electron-dl';

declare global {
  type UiServiceBridge = {
    getTheme(): Promise<ElectronTheme>;
    getThemeSource(): Promise<ThemeSource>;
    setThemeSource(themeSource: ThemeSource): Promise<void>;
    minimizeWindow(): Promise<void>;
    maximizeWindow(): Promise<void>;
    closeWindow(): Promise<void>;
    downloadFile(url: string, options?: electronDl.Options): Promise<void>;
    isMac: boolean;
    isWindows: boolean;
    isLinux: boolean;
  };

  interface Window {
    ui: UiServiceBridge;
  }
}

export {};
