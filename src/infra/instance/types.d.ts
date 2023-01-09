import { InstanceHealth } from '../configuration/model/configuration';

declare global {
  type InstanceInfoBridge = {
    fetchInstanceHealthById: (instanceId: string) => Promise<InstanceHealth>;
  };

  interface Window {
    instanceInfo: InstanceInfoBridge;
  }
}

export {};
