import { ipcRenderer } from 'electron';

export const instanceInfoBridge: InstanceInfoBridge = {
  fetchInstanceHealthById: (id: string) => ipcRenderer.invoke('instanceInfoService:fetchInstanceHealthById', id),
};
