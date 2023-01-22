import { ipcMain } from 'electron';
import { ActuatorClient } from './actuatorClient';
import { actuatorClientStore } from './actuatorClientStore';

ipcMain.handle('actuator:testConnectionByUrl', async (event, url) => {
  const client = new ActuatorClient(url);
  return client.testConnection();
});
ipcMain.handle('actuator:testConnection', async (event, instanceId) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.testConnection();
});
ipcMain.handle('actuator:endpoints', async (event, instanceId) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.endpoints();
});
ipcMain.handle('actuator:health', async (event, instanceId) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.health();
});

ipcMain.handle('actuator:healthComponent', async (event, instanceId, name) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.healthComponent(name);
});

ipcMain.handle('actuator:info', async (event, instanceId) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.info();
});

ipcMain.handle('actuator:caches', async (event, instanceId) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.caches();
});

ipcMain.handle('actuator:cache', async (event, instanceId, name) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.cache(name);
});

ipcMain.handle('actuator:evictAllCaches', async (event, instanceId) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  await client.evictAllCaches();
});

ipcMain.handle('actuator:evictCache', async (event, instanceId, name) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  await client.evictCache(name);
});

ipcMain.handle('actuator:beans', async (event, instanceId) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.beans();
});

ipcMain.handle('actuator:logfile', async (event, instanceId) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.logfile();
});

ipcMain.handle('actuator:logfileRange', async (event, instanceId, start, end) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.logfileRange(start, end);
});

ipcMain.handle('actuator:flyway', async (event, instanceId) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.flyway();
});

ipcMain.handle('actuator:liquibase', async (event, instanceId) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.liquibase();
});

ipcMain.handle('actuator:metrics', async (event, instanceId) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.metrics();
});

ipcMain.handle('actuator:metric', async (event, instanceId, name, tags) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.metric(name, tags);
});

ipcMain.handle('actuator:shutdown', async (event, instanceId) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  await client.shutdown();
});

ipcMain.handle('actuator:env', async (event, instanceId) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.env();
});

ipcMain.handle('actuator:envProperty', async (event, instanceId, name) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.envProperty(name);
});

ipcMain.handle('actuator:threadDump', async (event, instanceId) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.threadDump();
});

ipcMain.handle('actuator:loggers', async (event, instanceId) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.loggers();
});

ipcMain.handle('actuator:logger', async (event, instanceId, name) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  return client.logger(name);
});

ipcMain.handle('actuator:updateLogger', async (event, instanceId, name, level) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  await client.updateLogger(name, level);
});

ipcMain.handle('actuator:clearLogger', async (event, instanceId, name) => {
  const client = actuatorClientStore.getActuatorClient(instanceId);
  await client.clearLogger(name);
});
