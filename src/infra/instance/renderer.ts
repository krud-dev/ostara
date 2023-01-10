import { ipcRenderer } from 'electron';

export const instanceServiceBridge: InstanceServiceBridge = {
  fetchInstanceHealthById: (id: string) => ipcRenderer.invoke('instanceService:fetchInstanceHealthById', id),
  getInstanceCaches: (instanceId: string) => ipcRenderer.invoke('instanceService:getInstanceCaches', instanceId),
  getInstanceCache: (instanceId: string, cacheName: string) =>
    ipcRenderer.invoke('instanceService:getInstanceCache', instanceId, cacheName),
  evictInstanceCaches: (instanceId: string, cacheNames: string[]) =>
    ipcRenderer.invoke('instanceService:evictInstanceCaches', instanceId, cacheNames),
  evictAllInstanceCaches: (instanceId: string) =>
    ipcRenderer.invoke('instanceService:evictAllInstanceCaches', instanceId),
  getApplicationCaches: (applicationId: string) =>
    ipcRenderer.invoke('instanceService:getApplicationCaches', applicationId),
  getApplicationCache: (applicationId: string, cacheName: string) =>
    ipcRenderer.invoke('instanceService:getApplicationCache', applicationId, cacheName),
  evictApplicationCaches: (applicationId: string, cacheNames: string[]) =>
    ipcRenderer.invoke('instanceService:evictApplicationCaches', applicationId, cacheNames),
  evictAllApplicationCaches: (applicationId: string) =>
    ipcRenderer.invoke('instanceService:evictAllApplicationCaches', applicationId),
};
