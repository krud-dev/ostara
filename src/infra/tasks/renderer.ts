import { ipcRenderer } from 'electron';
import { TaskServiceBridge } from './types';

export const taskServiceBridge: TaskServiceBridge = {
  getTasksForDisplay: () => ipcRenderer.invoke('taskService:getTasksForDisplay'),
  getTaskForDisplay: (name: string) => ipcRenderer.invoke('taskService:getTaskForDisplay', name),
};
