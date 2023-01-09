import { ipcRenderer } from 'electron';

export const instanceServiceBridge: InstanceServiceBridge = {
  fetchInstanceHealthById: (id: string) => ipcRenderer.invoke('instanceService:fetchInstanceHealthById', id),
  getInstanceCaches: (instanceId: string) => ipcRenderer.invoke('instanceService:getInstanceCaches', instanceId),
  getInstanceCache: (instanceId: string, cacheName: string) =>
    ipcRenderer.invoke('instanceService:getInstanceCache', instanceId, cacheName),
  evictInstanceCache: (instanceId: string, cacheName: string) =>
    ipcRenderer.invoke('instanceService:evictInstanceCache', instanceId, cacheName),
  evictAllInstanceCaches: (instanceId: string) =>
    ipcRenderer.invoke('instanceService:evictAllInstanceCaches', instanceId),
};
