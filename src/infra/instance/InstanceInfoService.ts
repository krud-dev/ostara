import NodeCache from 'node-cache';
import {
  Application,
  ApplicationHealth,
  ApplicationHealthStatus,
  Instance,
  InstanceHealth,
} from '../configuration/model/configuration';
import { ActuatorClient } from '../actuator/actuatorClient';
import { configurationService } from '../configuration/configurationService';

class InstanceInfoService {
  private readonly instanceHealthCache = new NodeCache();

  private readonly applicationHealthCache = new NodeCache();

  private readonly endpointsCache = new NodeCache();

  getCachedInstanceHealth(instance: Instance): InstanceHealth {
    return (
      this.instanceHealthCache.get<InstanceHealth>(instance.id) ?? {
        status: 'PENDING',
        lastUpdateTime: Date.now(),
      }
    );
  }

  getCachedApplicationHealth(application: Application): ApplicationHealth {
    return (
      this.applicationHealthCache.get<ApplicationHealth>(application.id) ?? {
        status: 'PENDING',
        lastUpdateTime: Date.now(),
      }
    );
  }

  getCachedInstanceEndpoints(instance: Instance): string[] | undefined {
    return this.endpointsCache.get<string[]>(instance.id);
  }

  invalidateInstance(instance: Instance): void {
    this.instanceHealthCache.del(instance.id);
    this.endpointsCache.del(instance.id);
    this.applicationHealthCache.del(instance.parentApplicationId);
  }

  invalidateApplication(applicationId: string): void {
    this.applicationHealthCache.del(applicationId);
  }

  async fetchInstanceHealth(instance: Instance): Promise<InstanceHealth> {
    const client = new ActuatorClient(instance.actuatorUrl);
    let instanceHealth: InstanceHealth;
    try {
      const { status } = await client.health();
      instanceHealth = {
        status,
        lastUpdateTime: Date.now(),
      };
    } catch (e: unknown) {
      instanceHealth = {
        status: 'UNREACHABLE',
        lastUpdateTime: Date.now(),
      };
    }
    this.instanceHealthCache.set(instance.id, instanceHealth);
    this.applicationHealthCache.set<ApplicationHealth>(instance.parentApplicationId, {
      status: this.computeApplicationHealthStatus(instance.parentApplicationId),
      lastUpdateTime: Date.now(),
    });
    return instanceHealth;
  }

  async fetchInstanceEndpoints(instance: Instance): Promise<string[]> {
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

  private computeApplicationHealthStatus(applicationId: string): ApplicationHealthStatus {
    const instances = configurationService.getApplicationInstances(applicationId);
    if (!instances) {
      return 'PENDING';
    }

    if (instances.some((instance) => instance.health.status === 'PENDING' || instance.health.status === 'UNKNOWN')) {
      return 'PENDING';
    }

    if (instances.every((instance) => instance.health.status === 'UP')) {
      return 'ALL_UP';
    }

    if (
      instances.every(
        (instance) =>
          instance.health.status === 'DOWN' ||
          instance.health.status === 'UNREACHABLE' ||
          instance.health.status === 'OUT_OF_SERVICE'
      )
    ) {
      return 'ALL_DOWN';
    }
    return 'SOME_DOWN';
  }
}

export const instanceInfoService = new InstanceInfoService();
