import { ipcMain } from 'electron';
import { taskService } from './taskService';

ipcMain.handle('taskService:getTasksForDisplay', async () => {
  return taskService.getTasksForDisplay();
});

ipcMain.handle('taskService:getTaskForDisplay', async (event, name) => {
  return taskService.getTaskForDisplay(name);
});

ipcMain.handle('taskService:runTask', async (event, name) => {
  return taskService.runTask(name);
});
