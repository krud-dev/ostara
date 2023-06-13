import { ipcMain } from 'electron';
import { notificationsService } from './notificationsService';
import log from 'electron-log';

ipcMain.handle('notificationsService:sendNotification', (event, info) => notificationsService.sendNotification(info));
ipcMain.handle('notificationsService:canSendNotifications', () => notificationsService.canSendNotifications());

ipcMain.on('notificationsService:canOpenOsSettings', (event) => {
  event.returnValue = notificationsService.canOpenOsSettings();
});

ipcMain.on('notificationsService:openOsSettings', () => {
  notificationsService.openOsSettings().catch((error) => {
    log.error('Error opening OS settings', error);
  });
});
