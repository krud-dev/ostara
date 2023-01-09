import { InstanceHealth } from '../configuration/model/configuration';
import { InstanceCache } from './models/cache';

declare global {
  type InstanceServiceBridge = {
    fetchInstanceHealthById: (instanceId: string) => Promise<InstanceHealth>;
    getInstanceCaches: (instanceId: string) => Promise<InstanceCache[]>;
    getInstanceCache: (instanceId: string, cacheName: string) => Promise<InstanceCache>;
    evictInstanceCache: (instanceId: string, cacheName: string) => Promise<void>;
    evictAllInstanceCaches: (instanceId: string) => Promise<void>;
  };

  interface Window {
    instanceService: InstanceServiceBridge;
  }
}

export {};
