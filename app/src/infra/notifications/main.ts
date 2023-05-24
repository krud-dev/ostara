import { ipcMain } from 'electron';
import { notificationsService } from './notificationsService';

ipcMain.handle('notificationsService:sendNotification', (event, info) => notificationsService.sendNotification(info));
