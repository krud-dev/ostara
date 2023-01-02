import { ipcMain } from 'electron';
import { taskService } from './taskService';

ipcMain.handle('taskService:getTasksForDisplay', async () => {
  return taskService.getTasksForDisplay();
});

ipcMain.handle('taskService:getTaskForDisplay', async (event, name) => {
  return taskService.getTaskForDisplay(name);
});
