import { ipcRenderer } from 'electron';

export const actuatorFacade = {
  health: (url: string) => ipcRenderer.sendSync('actuator:health', url),
  healthComponent: (url: string, name: string) =>
    ipcRenderer.sendSync('actuator:healthComponent', url, name),
  info: (url: string) => ipcRenderer.sendSync('actuator:info', url),
  caches: (url: string) => ipcRenderer.sendSync('actuator:caches', url),
  cache: (url: string, name: string) =>
    ipcRenderer.sendSync('actuator:cache', url, name),
  evictAllCaches: (url: string) =>
    ipcRenderer.sendSync('actuator:evictAllCaches', url),
  evictCache: (url: string, name: string) =>
    ipcRenderer.sendSync('actuator:evictCache', url, name),
  logfile: (url: string) => ipcRenderer.sendSync('actuator:logfile', url),
  logfileRange: (url: string, start: number, end: number) =>
    ipcRenderer.sendSync('actuator:logfileRange', start, end),
  metrics: (url: string) => ipcRenderer.sendSync('actuator:metrics', url),
  metric: (url: string, name: string, tags: { [key: string]: string }) =>
    ipcRenderer.sendSync('actuator:metric', url, name, tags),
  shutdown: (url: string) => ipcRenderer.sendSync('actuator:shutdown', url),
  env: (url: string) => ipcRenderer.sendSync('actuator:env', url),
  envProperty: (url: string, name: string) =>
    ipcRenderer.sendSync('actuator:envProperty', url, name),
  threadDump: (url: string) => ipcRenderer.sendSync('actuator:threadDump', url),
  loggers: (url: string) => ipcRenderer.sendSync('actuator:loggers', url),
  logger: (url: string, name: string) =>
    ipcRenderer.sendSync('actuator:logger', url, name),
  updateLogger: (url: string, name: string, level: string) =>
    ipcRenderer.sendSync('actuator:updateLogger', url, name, level),
  clearLogger: (url: string, name: string) =>
    ipcRenderer.sendSync('actuator:clearLogger', url, name),
};
