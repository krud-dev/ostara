import { BrowserWindow, nativeTheme } from 'electron';

class UiService {
  initializeListeners(window: BrowserWindow) {
    nativeTheme.on('updated', () => {
      window.webContents.send('app:themeUpdated', {
        shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
        shouldUseHighContrastColors: nativeTheme.shouldUseHighContrastColors,
        shouldUseInvertedColorScheme: nativeTheme.shouldUseInvertedColorScheme,
      });
    });
  }

  getThemeSource(): 'system' | 'light' | 'dark' {
    return nativeTheme.themeSource;
  }

  setThemeSource(themeSource: 'system' | 'light' | 'dark') {
    nativeTheme.themeSource = themeSource;
  }
}

export const uiService = new UiService();
