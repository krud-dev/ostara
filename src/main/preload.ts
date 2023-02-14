import { contextBridge } from 'electron';
import { utilsBridge } from '../infra/rendererUtils/renderer';
import { subscriptionsBridge } from '../infra/subscriptions/renderer';
import { uiServiceBridge } from '../infra/ui/renderer';
import { daemonAddressSupplier } from '../infra/daemon/renderer';
import { configurationStore } from '../infra/configuration/configurationStore';
import { configurationStoreBridge } from '../infra/configuration/renderer';

contextBridge.exposeInMainWorld('configurationStore', configurationStoreBridge);
contextBridge.exposeInMainWorld('utils', utilsBridge);
contextBridge.exposeInMainWorld('subscriptions', subscriptionsBridge);
contextBridge.exposeInMainWorld('ui', uiServiceBridge);
contextBridge.exposeInMainWorld('isElectron', true);
contextBridge.exposeInMainWorld('daemonAddress', daemonAddressSupplier());
