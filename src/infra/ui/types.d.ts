import { ElectronTheme } from './models/electronTheme';

declare global {
  type UiServiceBridge = {
    getTheme(): Promise<ElectronTheme>;
    getThemeSource(): Promise<'system' | 'light' | 'dark'>;
    setThemeSource(themeSource: 'system' | 'light' | 'dark'): Promise<void>;
    minimizeWindow(): Promise<void>;
    maximizeWindow(): Promise<void>;
    closeWindow(): Promise<void>;
    isMac: boolean;
    isWindows: boolean;
    isLinux: boolean;
  };

  interface Window {
    ui: UiServiceBridge;
  }
}

export {};
