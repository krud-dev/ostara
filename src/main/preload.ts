import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { actuatorBridge } from '../infra/actuator/renderer';
import { configurationServiceBridge, configurationStoreBridge } from '../infra/configuration/renderer';
import { metricsServiceBridge } from '../infra/metrics/renderer';
import { utilsBridge } from '../infra/rendererUtils/renderer';
import { taskServiceBridge } from '../infra/tasks/renderer';
import { subscriptionsBridge } from '../infra/subscriptions/renderer';
import { instanceServiceBridge } from '../infra/instance/renderer';

contextBridge.exposeInMainWorld('electron', {
  configurationStore: configurationStoreBridge,
});
contextBridge.exposeInMainWorld('actuator', actuatorBridge);
contextBridge.exposeInMainWorld('configuration', configurationServiceBridge);
contextBridge.exposeInMainWorld('metrics', metricsServiceBridge);
contextBridge.exposeInMainWorld('task', taskServiceBridge);
contextBridge.exposeInMainWorld('utils', utilsBridge);
contextBridge.exposeInMainWorld('subscriptions', subscriptionsBridge);
contextBridge.exposeInMainWorld('instance', instanceServiceBridge);
