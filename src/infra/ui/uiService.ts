import { app, BrowserWindow, nativeTheme } from 'electron';
import { ElectronTheme, ThemeSource } from './models/electronTheme';
import log from 'electron-log';
import electronDl, { download } from 'electron-dl';

class UiService {
  private window: BrowserWindow | undefined;

  initialize(window: BrowserWindow) {
    log.info(`Initializing ui service for window ${window.id}`);

    this.window = window;

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

  getThemeSource(): ThemeSource {
    return nativeTheme.themeSource;
  }

  setThemeSource(themeSource: ThemeSource) {
    nativeTheme.themeSource = themeSource;
  }

  minimizeWindow(): void {
    this.window?.minimize();
  }

  maximizeWindow(): void {
    if (this.window?.isMaximized()) {
      this.window?.unmaximize();
    } else {
      this.window?.maximize();
    }
  }

  closeWindow(): void {
    this.window?.close();
  }

  restartApp(): void {
    app.relaunch();
    app.quit();
  }

  downloadFile(url: string, options?: electronDl.Options): void {
    download(this.window!, url, options);
  }
}

export const uiService = new UiService();
