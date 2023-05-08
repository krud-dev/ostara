import { ipcMain } from 'electron';
import { demoService } from './demoService';

ipcMain.handle('demo:start', async () => {
  return demoService.startDemo();
});

ipcMain.handle('demo:stop', async () => {
  return demoService.stopDemo();
});

ipcMain.on('demo:getAddress', (event) => {
  event.returnValue = demoService.getAddress();
});

ipcMain.on('demo:isStarted', (event) => {
  event.returnValue = demoService.isStarted();
});
