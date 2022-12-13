import { ipcRenderer } from 'electron';

export const actuatorBridge = {
  health: (url: string) => ipcRenderer.invoke('actuator:health', url),
  healthComponent: (url: string, name: string) =>
    ipcRenderer.invoke('actuator:healthComponent', url, name),
  info: (url: string) => ipcRenderer.invoke('actuator:info', url),
  caches: (url: string) => ipcRenderer.invoke('actuator:caches', url),
  cache: (url: string, name: string) =>
    ipcRenderer.invoke('actuator:cache', url, name),
  evictAllCaches: (url: string) =>
    ipcRenderer.invoke('actuator:evictAllCaches', url),
  evictCache: (url: string, name: string) =>
    ipcRenderer.invoke('actuator:evictCache', url, name),
  logfile: (url: string) => ipcRenderer.invoke('actuator:logfile', url),
  logfileRange: (url: string, start: number, end: number) =>
    ipcRenderer.invoke('actuator:logfileRange', start, end),
  metrics: (url: string) => ipcRenderer.invoke('actuator:metrics', url),
  metric: (url: string, name: string, tags: { [key: string]: string }) =>
    ipcRenderer.invoke('actuator:metric', url, name, tags),
  shutdown: (url: string) => ipcRenderer.invoke('actuator:shutdown', url),
  env: (url: string) => ipcRenderer.invoke('actuator:env', url),
  envProperty: (url: string, name: string) =>
    ipcRenderer.invoke('actuator:envProperty', url, name),
  threadDump: (url: string) => ipcRenderer.invoke('actuator:threadDump', url),
  loggers: (url: string) => ipcRenderer.invoke('actuator:loggers', url),
  logger: (url: string, name: string) =>
    ipcRenderer.invoke('actuator:logger', url, name),
  updateLogger: (url: string, name: string, level: string) =>
    ipcRenderer.invoke('actuator:updateLogger', url, name, level),
  clearLogger: (url: string, name: string) =>
    ipcRenderer.invoke('actuator:clearLogger', url, name),
};
