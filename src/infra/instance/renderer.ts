import { ipcRenderer } from 'electron';

export const instanceServiceBridge: InstanceServiceBridge = {
  fetchInstanceHealthById: (id: string) => ipcRenderer.invoke('instanceService:fetchInstanceHealthById', id),
};
