import { ipcMain } from 'electron';
import { ActuatorClient } from './actuatorClient';

ipcMain.handle('actuator:testConnection', async (event, url) => {
  const client = new ActuatorClient(url);
  return client.testConnection();
});
ipcMain.handle('actuator:endpoints', async (event, url) => {
  const client = new ActuatorClient(url);
  return client.endpoints();
});
ipcMain.handle('actuator:health', async (event, url) => {
  const client = new ActuatorClient(url);
  return client.health();
});

ipcMain.handle('actuator:healthComponent', async (event, url, name) => {
  const client = new ActuatorClient(url);
  return client.healthComponent(name);
});

ipcMain.handle('actuator:info', async (event, url) => {
  const client = new ActuatorClient(url);
  return client.info();
});

ipcMain.handle('actuator:caches', async (event, url) => {
  const client = new ActuatorClient(url);
  return client.caches();
});

ipcMain.handle('actuator:cache', async (event, url, name) => {
  const client = new ActuatorClient(url);
  return client.cache(name);
});

ipcMain.handle('actuator:evictAllCaches', async (event, url) => {
  const client = new ActuatorClient(url);
  await client.evictAllCaches();
});

ipcMain.handle('actuator:evictCache', async (event, url, name) => {
  const client = new ActuatorClient(url);
  await client.evictCache(name);
});

ipcMain.handle('actuator:logfile', async (event, url) => {
  const client = new ActuatorClient(url);
  return client.logfile();
});

ipcMain.handle('actuator:logfileRange', async (event, url, start, end) => {
  const client = new ActuatorClient(url);
  return client.logfileRange(start, end);
});

ipcMain.handle('actuator:metrics', async (event, url) => {
  const client = new ActuatorClient(url);
  return client.metrics();
});

ipcMain.handle('actuator:metric', async (event, url, name, tags) => {
  const client = new ActuatorClient(url);
  return client.metric(name, tags);
});

ipcMain.handle('actuator:shutdown', async (event, url) => {
  const client = new ActuatorClient(url);
  await client.shutdown();
});

ipcMain.handle('actuator:env', async (event, url) => {
  const client = new ActuatorClient(url);
  return client.env();
});

ipcMain.handle('actuator:envProperty', async (event, url, name) => {
  const client = new ActuatorClient(url);
  return client.envProperty(name);
});

ipcMain.handle('actuator:threadDump', async (event, url) => {
  const client = new ActuatorClient(url);
  return client.threadDump();
});

ipcMain.handle('actuator:loggers', async (event, url) => {
  const client = new ActuatorClient(url);
  return client.loggers();
});

ipcMain.handle('actuator:logger', async (event, url, name) => {
  const client = new ActuatorClient(url);
  return client.logger(name);
});

ipcMain.handle('actuator:updateLogger', async (event, url, name, level) => {
  const client = new ActuatorClient(url);
  await client.updateLogger(name, level);
});

ipcMain.handle('actuator:clearLogger', async (event, url, name) => {
  const client = new ActuatorClient(url);
  await client.clearLogger(name);
});
