import { ipcMain } from 'electron';
import { getDaemonController } from './daemon';

ipcMain.on('daemon:address', (event) => {
  event.returnValue = getDaemonController()?.daemonAddress;
});
