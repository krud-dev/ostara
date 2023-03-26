import { ipcMain } from 'electron';
import { getDaemonController } from './daemon';

ipcMain.on('daemon:address', (event) => {
  event.returnValue = getDaemonController()?.daemonAddress;
});

ipcMain.on('daemon:wsAddress', (event) => {
  event.returnValue = getDaemonController()?.daemonWsAddress;
});

ipcMain.on('daemon:healthy', (event) => {
  event.returnValue = getDaemonController()?.isHealthy() ?? false;
});
