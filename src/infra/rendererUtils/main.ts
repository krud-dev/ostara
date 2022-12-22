import { ipcMain } from 'electron';
import { v4 as uuidv4 } from 'uuid';

ipcMain.handle('utils:uuidv4', async (event) => {
  return uuidv4();
});
