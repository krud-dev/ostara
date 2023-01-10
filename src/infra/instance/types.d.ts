import { InstanceHealth } from '../configuration/model/configuration';
import { ApplicationCache, InstanceCache } from './models/cache';

declare global {
  type InstanceServiceBridge = {
    fetchInstanceHealthById: (instanceId: string) => Promise<InstanceHealth>;
    getInstanceCaches: (instanceId: string) => Promise<InstanceCache[]>;
    getInstanceCache: (instanceId: string, cacheName: string) => Promise<InstanceCache>;
    evictInstanceCache: (instanceId: string, cacheName: string) => Promise<void>;
    evictAllInstanceCaches: (instanceId: string) => Promise<void>;

    getApplicationCaches: (applicationId: string) => Promise<ApplicationCache[]>;
    getApplicationCache: (applicationId: string, cacheName: string) => Promise<ApplicationCache>;
    evictApplicationCaches: (applicationId: string, cacheNames: string[]) => Promise<void>;
    evictAllApplicationCaches: (applicationId: string) => Promise<void>;
  };

  interface Window {
    instanceService: InstanceServiceBridge;
  }
}

export {};
