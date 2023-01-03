import NodeCache from 'node-cache';
import { Instance } from '../configuration/model/configuration';
import { ActuatorClient } from '../actuator/actuatorClient';
import { InstanceHealth } from './models/health';

class InstanceInfoService {
  private readonly healthCache = new NodeCache();

  private readonly endpointsCache = new NodeCache();

  getCachedInstanceHealth(instance: Instance): InstanceHealth {
    return (
      this.healthCache.get<InstanceHealth>(instance.id) ?? {
        status: 'PENDING',
        lastUpdateTime: Date.now(),
      }
    );
  }

  getCachedInstanceEndpoints(instance: Instance): string[] | undefined {
    return this.endpointsCache.get<string[]>(instance.id);
  }

  invalidateInstance(instanceId: string): void {
    this.healthCache.del(instanceId);
  }

  async fetchInstanceHealth(instance: Instance, useCache = false): Promise<InstanceHealth> {
    if (useCache) {
      const cached = this.healthCache.get<InstanceHealth>(instance.id);
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
      this.healthCache.set(instance.id, instanceHealth);
      return instanceHealth;
    } catch (e: unknown) {
      const instanceHealth: InstanceHealth = {
        status: 'UNREACHABLE',
        lastUpdateTime: Date.now(),
      };
      this.healthCache.set(instance.id, instanceHealth);
      return instanceHealth;
    }
  }

  async fetchInstanceEndpoints(instance: Instance, useCache = false): Promise<string[]> {
    if (useCache) {
      const cached = this.endpointsCache.get<string[]>(instance.id);
      if (cached) {
        return cached;
      }
    }
    const client = new ActuatorClient(instance.actuatorUrl);
    try {
      const endpoints = await client.endpoints();
      this.endpointsCache.set(instance.id, endpoints);
      return endpoints;
    } catch (e: unknown) {
      console.error(`Couldn't fetch endpoints for instance ${instance.id}`, e);
      return [];
    }
  }
}

export const instanceInfoService = new InstanceInfoService();
