import { InstanceHealth } from '../configuration/model/configuration';

declare global {
  type InstanceServiceBridge = {
    fetchInstanceHealthById: (instanceId: string) => Promise<InstanceHealth>;
  };

  interface Window {
    instanceService: InstanceServiceBridge;
  }
}

export {};
