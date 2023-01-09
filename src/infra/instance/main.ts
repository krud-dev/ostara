import { ipcMain } from 'electron';
import { instanceInfoService } from './InstanceInfoService';

ipcMain.handle('instanceInfoService:fetchInstanceHealthById', async (event, id) => {
  return instanceInfoService.fetchInstanceHealthById(id);
});
