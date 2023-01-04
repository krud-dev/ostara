import { ipcRenderer } from 'electron';

export const taskServiceBridge: TaskServiceBridge = {
  getTasksForDisplay: () => ipcRenderer.invoke('taskService:getTasksForDisplay'),
  getTaskForDisplay: (name: string) => ipcRenderer.invoke('taskService:getTaskForDisplay', name),
  runTask: (name: string) => ipcRenderer.invoke('taskService:runTask', name),
};
