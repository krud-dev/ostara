import { ipcMain } from 'electron';
import { instanceService } from './InstanceService';

ipcMain.handle('instanceService:fetchInstanceHealthById', async (event, id) => {
  return instanceService.fetchInstanceHealthById(id);
});
