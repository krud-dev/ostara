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
import { BrowserWindow } from 'electron';
import log from 'electron-log';

class InstanceInfoService {
  private readonly instanceHealthCache = new NodeCache();

  private readonly applicationHealthCache = new NodeCache();

  private readonly endpointsCache = new NodeCache();

  initializeListeners(window: BrowserWindow) {
    log.info(`Initializing listeners for window ${window.id}`);
    this.instanceHealthCache.addListener('set', (key: string, value: InstanceHealth) => {
      window.webContents.send('app:instanceHealthUpdated', key, value);
    });

    this.applicationHealthCache.addListener('set', (key: string, value: ApplicationHealth) => {
      window.webContents.send('app:applicationHealthUpdated', key, value);
    });
    this.endpointsCache.addListener('set', (key: string, value: string[]) => {
      window.webContents.send('app:instanceEndpointsUpdated', key, value);
    });
  }

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

  getCachedInstanceEndpoints(instance: Instance): string[] {
    return this.endpointsCache.get<string[]>(instance.id) ?? [];
  }

  invalidateInstance(instance: Instance): void {
    this.fetchInstanceHealth(instance);
    this.fetchInstanceEndpoints(instance);
  }

  invalidateApplication(applicationId: string): void {
    this.computeAndSaveApplicationHealth(applicationId);
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
    this.computeAndSaveApplicationHealth(instance.parentApplicationId);
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

  private computeAndSaveApplicationHealth(applicationId: string) {
    this.applicationHealthCache.set<ApplicationHealth>(applicationId, {
      status: this.getApplicationHealthStatus(applicationId),
      lastUpdateTime: Date.now(),
    });
  }

  private getApplicationHealthStatus(applicationId: string): ApplicationHealthStatus {
    const instances = configurationService.getApplicationInstances(applicationId);
    if (instances.length === 0) {
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
