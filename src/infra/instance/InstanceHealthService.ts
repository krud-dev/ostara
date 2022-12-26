import NodeCache from 'node-cache';
import { Instance, InstanceHealthStatus } from '../configuration/model/configuration';
import { ActuatorClient } from '../actuator/actuatorClient';

export type InstanceHealth = {
  status: InstanceHealthStatus;
  lastUpdateTime: number;
};
class InstanceHealthService {
  private readonly cache = new NodeCache();

  getCachedInstanceHealth(instance: Instance): InstanceHealth {
    return (
      this.cache.get<InstanceHealth>(instance.id) ?? {
        status: 'PENDING',
        lastUpdateTime: Date.now(),
      }
    );
  }

  invalidateInstance(instanceId: string): void {
    this.cache.del(instanceId);
  }

  async fetchInstanceHealth(instance: Instance, useCache = false): Promise<InstanceHealth> {
    if (useCache) {
      const cached = this.cache.get<InstanceHealth>(instance.id);
      if (cached) {
        return cached;
      }
    }
    const client = new ActuatorClient(instance.actuatorUrl);
    try {
      const { status } = await client.health();
      const instanceHealth: InstanceHealth = {
        status,
        lastUpdateTime: Date.now(),
      };
      this.cache.set(instance.id, instanceHealth);
      return instanceHealth;
    } catch (e: unknown) {
      const instanceHealth: InstanceHealth = {
        status: 'UNREACHABLE',
        lastUpdateTime: Date.now(),
      };
      this.cache.set(instance.id, instanceHealth);
      return instanceHealth;
    }
  }
}

export const instanceHealthService = new InstanceHealthService();
