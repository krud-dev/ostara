import { ElectronTheme } from './models/electronTheme';

declare global {
  type UiServiceBridge = {
    getTheme(): Promise<ElectronTheme>;
    getThemeSource(): Promise<'system' | 'light' | 'dark'>;
    setThemeSource(themeSource: 'system' | 'light' | 'dark'): Promise<void>;
  };

  interface Window {
    ui: UiServiceBridge;
  }
}

export {};
