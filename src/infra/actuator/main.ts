import { ipcMain } from 'electron';
import { ActuatorClient } from './actuatorClient';

ipcMain.on('actuator:health', async (event, url) => {
  const client = new ActuatorClient(url);
  event.returnValue = await client.health();
});

ipcMain.on('actuator:healthComponent', async (event, url, name) => {
  const client = new ActuatorClient(url);
  event.returnValue = await client.healthComponent(name);
});

ipcMain.on('actuator:info', async (event, url) => {
  const client = new ActuatorClient(url);
  event.returnValue = await client.info();
});

ipcMain.on('actuator:caches', async (event, url) => {
  const client = new ActuatorClient(url);
  event.returnValue = await client.caches();
});

ipcMain.on('actuator:cache', async (event, url, name) => {
  const client = new ActuatorClient(url);
  event.returnValue = await client.cache(name);
});

ipcMain.on('actuator:evictAllCaches', async (event, url) => {
  const client = new ActuatorClient(url);
  await client.evictAllCaches();
});

ipcMain.on('actuator:evictCache', async (event, url, name) => {
  const client = new ActuatorClient(url);
  await client.evictCache(name);
});

ipcMain.on('actuator:logfile', async (event, url) => {
  const client = new ActuatorClient(url);
  event.returnValue = await client.logfile();
});

ipcMain.on('actuator:logfileRange', async (event, url, start, end) => {
  const client = new ActuatorClient(url);
  event.returnValue = await client.logfileRange(start, end);
});

ipcMain.on('actuator:metrics', async (event, url) => {
  const client = new ActuatorClient(url);
  event.returnValue = await client.metrics();
});

ipcMain.on('actuator:metric', async (event, url, name, tags) => {
  const client = new ActuatorClient(url);
  event.returnValue = await client.metric(name, tags);
});

ipcMain.on('actuator:shutdown', async (event, url) => {
  const client = new ActuatorClient(url);
  await client.shutdown();
});

ipcMain.on('actuator:env', async (event, url) => {
  const client = new ActuatorClient(url);
  event.returnValue = await client.env();
});

ipcMain.on('actuator:envProperty', async (event, url, name) => {
  const client = new ActuatorClient(url);
  event.returnValue = await client.envProperty(name);
});

ipcMain.on('actuator:threadDump', async (event, url) => {
  const client = new ActuatorClient(url);
  event.returnValue = await client.threadDump();
});

ipcMain.on('actuator:loggers', async (event, url) => {
  const client = new ActuatorClient(url);
  event.returnValue = await client.loggers();
});

ipcMain.on('actuator:logger', async (event, url, name) => {
  const client = new ActuatorClient(url);
  event.returnValue = await client.logger(name);
});

ipcMain.on('actuator:updateLogger', async (event, url, name, level) => {
  const client = new ActuatorClient(url);
  await client.updateLogger(name, level);
});

ipcMain.on('actuator:clearLogger', async (event, url, name) => {
  const client = new ActuatorClient(url);
  await client.clearLogger(name);
});
