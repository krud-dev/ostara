import { contextBridge } from 'electron';
import { utilsBridge } from '../infra/rendererUtils/renderer';
import { subscriptionsBridge } from '../infra/subscriptions/renderer';
import { uiServiceBridge } from '../infra/ui/renderer';
import { daemonAddressSupplier, daemonHealthySupplier, daemonWsAddressSupplier } from '../infra/daemon/renderer';

contextBridge.exposeInMainWorld('utils', utilsBridge);
contextBridge.exposeInMainWorld('subscriptions', subscriptionsBridge);
contextBridge.exposeInMainWorld('ui', uiServiceBridge);
contextBridge.exposeInMainWorld('isElectron', true);
contextBridge.exposeInMainWorld('daemonAddress', daemonAddressSupplier());
contextBridge.exposeInMainWorld('daemonWsAddress', daemonWsAddressSupplier());
contextBridge.exposeInMainWorld('daemonHealthy', daemonHealthySupplier());
contextBridge.exposeInMainWorld('NODE_ENV', process.env.NODE_ENV);
