import { BrowserWindow, nativeTheme } from 'electron';
import { ElectronTheme } from './models/electronTheme';

class UiService {
  initializeListeners(window: BrowserWindow) {
    nativeTheme.on('updated', () => {
      window.webContents.send('app:themeUpdated', this.getElectronTheme());
    });
  }

  getElectronTheme(): ElectronTheme {
    return {
      shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
      shouldUseHighContrastColors: nativeTheme.shouldUseHighContrastColors,
      shouldUseInvertedColorScheme: nativeTheme.shouldUseInvertedColorScheme,
    };
  }

  getThemeSource(): 'system' | 'light' | 'dark' {
    return nativeTheme.themeSource;
  }

  setThemeSource(themeSource: 'system' | 'light' | 'dark') {
    nativeTheme.themeSource = themeSource;
  }
}

export const uiService = new UiService();
