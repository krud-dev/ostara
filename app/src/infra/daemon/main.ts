import { ipcMain } from 'electron';
import { getDaemonController } from './daemonController';

ipcMain.on('daemon:address', (event) => {
  event.returnValue = getDaemonController()?.getDaemonAddress();
});

ipcMain.on('daemon:wsAddress', (event) => {
  event.returnValue = getDaemonController()?.getDaemonWsAddress();
});

ipcMain.on('daemon:healthy', (event) => {
  event.returnValue = getDaemonController()?.isHealthy() ?? false;
});
