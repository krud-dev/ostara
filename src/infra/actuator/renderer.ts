import { ipcRenderer } from 'electron';

export const actuatorBridge: ActuatorBridge = {
  testConnectionByUrl: (url: string) => ipcRenderer.invoke('actuator:testConnectionByUrl', url),
  testConnection: (instanceId: string) => ipcRenderer.invoke('actuator:testConnection', instanceId),
  endpoints: (instanceId: string) => ipcRenderer.invoke('actuator:endpoints', instanceId),
  health: (instanceId: string) => ipcRenderer.invoke('actuator:health', instanceId),
  healthComponent: (instanceId: string, name: string) =>
    ipcRenderer.invoke('actuator:healthComponent', instanceId, name),
  info: (instanceId: string) => ipcRenderer.invoke('actuator:info', instanceId),
  caches: (instanceId: string) => ipcRenderer.invoke('actuator:caches', instanceId),
  cache: (instanceId: string, name: string) => ipcRenderer.invoke('actuator:cache', instanceId, name),
  evictAllCaches: (instanceId: string) => ipcRenderer.invoke('actuator:evictAllCaches', instanceId),
  evictCache: (instanceId: string, name: string) => ipcRenderer.invoke('actuator:evictCache', instanceId, name),
  beans: (instanceId: string) => ipcRenderer.invoke('actuator:beans', instanceId),
  logfile: (instanceId: string) => ipcRenderer.invoke('actuator:logfile', instanceId),
  logfileRange: (instanceId: string, start: number, end: number) =>
    ipcRenderer.invoke('actuator:logfileRange', start, end),
  flyway: (instanceId: string) => ipcRenderer.invoke('actuator:flyway', instanceId),
  liquibase: (instanceId: string) => ipcRenderer.invoke('actuator:liquibase', instanceId),
  metrics: (instanceId: string) => ipcRenderer.invoke('actuator:metrics', instanceId),
  metric: (instanceId: string, name: string, tags: { [key: string]: string }) =>
    ipcRenderer.invoke('actuator:metric', instanceId, name, tags),
  shutdown: (instanceId: string) => ipcRenderer.invoke('actuator:shutdown', instanceId),
  env: (instanceId: string) => ipcRenderer.invoke('actuator:env', instanceId),
  envProperty: (instanceId: string, name: string) => ipcRenderer.invoke('actuator:envProperty', instanceId, name),
  threadDump: (instanceId: string) => ipcRenderer.invoke('actuator:threadDump', instanceId),
  loggers: (instanceId: string) => ipcRenderer.invoke('actuator:loggers', instanceId),
  logger: (instanceId: string, name: string) => ipcRenderer.invoke('actuator:logger', instanceId, name),
  updateLogger: (instanceId: string, name: string, level: string) =>
    ipcRenderer.invoke('actuator:updateLogger', instanceId, name, level),
  clearLogger: (instanceId: string, name: string) => ipcRenderer.invoke('actuator:clearLogger', instanceId, name),
};
