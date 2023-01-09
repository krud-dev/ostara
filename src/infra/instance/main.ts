import { ipcMain } from 'electron';
import { instanceService } from './instanceService';

ipcMain.handle('instanceService:fetchInstanceHealthById', async (event, id) => {
  return instanceService.fetchInstanceHealthById(id);
});
