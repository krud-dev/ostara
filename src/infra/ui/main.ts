import { ipcMain } from 'electron';
import { uiService } from './uiService';

ipcMain.handle('uiService:getTheme', () => uiService.getElectronTheme());
ipcMain.handle('uiService:getThemeSource', (event) => uiService.getThemeSource());
ipcMain.handle('uiService:setThemeSource', (event, themeSource) => uiService.setThemeSource(themeSource));
ipcMain.handle('uiService:minimizeWindow', (event) => uiService.minimizeWindow());
ipcMain.handle('uiService:maximizeWindow', (event) => uiService.maximizeWindow());
ipcMain.handle('uiService:closeWindow', (event) => uiService.closeWindow());
ipcMain.handle('uiService:downloadFile', (event, url, options) => uiService.downloadFile(url, options));
