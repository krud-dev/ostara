import { ipcMain } from 'electron';
import { uiService } from './uiService';

ipcMain.handle('uiService:getTheme', () => uiService.getElectronTheme());
ipcMain.handle('uiService:getThemeSource', (event) => uiService.getThemeSource());
ipcMain.handle('uiService:setThemeSource', (event, themeSource) => uiService.setThemeSource(themeSource));
