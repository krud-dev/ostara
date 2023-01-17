import { ipcRenderer } from 'electron';
import { LogLevel } from 'electron-log';

export const instanceServiceBridge: InstanceServiceBridge = {
  propertyService: {
    getProperties: (instanceId: string) => ipcRenderer.invoke('instancePropertyService:getProperties', instanceId),
  },
  httpRequestStatisticsService: {
    getStatistics: (instanceId: string) =>
      ipcRenderer.invoke('instanceHttpRequestStatisticsService:getStatistics', instanceId),
  },
  getInstanceLoggers: (instanceId: string) => ipcRenderer.invoke('instanceService:getInstanceLoggers', instanceId),
  getInstanceLogger: (instanceId: string, loggerName: string) =>
    ipcRenderer.invoke('instanceService:getInstanceLogger', instanceId, loggerName),
  setInstanceLoggerLevel: (instanceId: string, loggerName: string, level: LogLevel | undefined) =>
    ipcRenderer.invoke('instanceService:setInstanceLoggerLevel', instanceId, loggerName, level),
  getApplicationLoggers: (applicationId: string) =>
    ipcRenderer.invoke('instanceService:getApplicationLoggers', applicationId),
  getApplicationLogger: (applicationId: string, loggerName: string) =>
    ipcRenderer.invoke('instanceService:getApplicationLogger', applicationId, loggerName),
  setApplicationLoggerLevel: (applicationId: string, loggerName: string, level: LogLevel | undefined) =>
    ipcRenderer.invoke('instanceService:setApplicationLoggerLevel', applicationId, loggerName, level),
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
