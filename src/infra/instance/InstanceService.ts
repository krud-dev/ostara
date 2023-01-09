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
import EventEmitter from 'events';

class InstanceService {
  private readonly instanceHealthCache = new NodeCache();

  private readonly applicationHealthCache = new NodeCache();

  private readonly endpointsCache = new NodeCache();

  private readonly events: EventEmitter = new EventEmitter();

  initializeListeners(window: BrowserWindow) {
    log.info(`Initializing listeners for window ${window.id}`);
    this.events.addListener('app:instanceHealthUpdated', (key: string, value: InstanceHealth) => {
      window.webContents.send('app:instanceHealthUpdated', key, value);
    });
    this.events.addListener('app:applicationHealthUpdated', (key: string, value: ApplicationHealth) => {
      window.webContents.send('app:applicationHealthUpdated', key, value);
    });
    this.events.addListener('app:instanceEndpointsUpdated', (key: string, value: string[]) => {
      window.webContents.send('app:instanceEndpointsUpdated', key, value);
    });
  }

  getCachedInstanceHealth(instance: Instance): InstanceHealth {
    return (
      this.instanceHealthCache.get<InstanceHealth>(instance.id) ?? {
        status: 'PENDING',
        lastUpdateTime: Date.now(),
        lastStatusChangeTime: Date.now(),
      }
    );
  }

  getCachedApplicationHealth(application: Application): ApplicationHealth {
    return (
      this.applicationHealthCache.get<ApplicationHealth>(application.id) ?? {
        status: 'PENDING',
        lastUpdateTime: Date.now(),
        lastStatusChangeTime: Date.now(),
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

  fetchInstanceHealthById(instanceId: string): Promise<InstanceHealth> {
    const instance = configurationService.getInstanceOrThrow(instanceId);
    return this.fetchInstanceHealth(instance);
  }

  async fetchInstanceHealth(instance: Instance): Promise<InstanceHealth> {
    const client = new ActuatorClient(instance.actuatorUrl);
    let instanceHealth: InstanceHealth;
    const oldHealth = this.instanceHealthCache.get<InstanceHealth>(instance.id);
    try {
      const { status } = await client.health();
      instanceHealth = {
        status,
        lastUpdateTime: Date.now(),
        lastStatusChangeTime: oldHealth?.status !== status ? Date.now() : oldHealth?.lastStatusChangeTime,
      };
    } catch (e: unknown) {
      let message;
      if (e instanceof Error) {
        message = e.message;
      } else {
        message = JSON.stringify(e);
      }
      instanceHealth = {
        status: 'UNREACHABLE',
        statusText: message,
        lastUpdateTime: Date.now(),
        lastStatusChangeTime: oldHealth?.status !== 'UNREACHABLE' ? Date.now() : oldHealth?.lastStatusChangeTime,
      };
    }
    this.instanceHealthCache.set(instance.id, instanceHealth);
    this.computeAndSaveApplicationHealth(instance.parentApplicationId);
    if (oldHealth?.status !== instanceHealth.status) {
      this.events.emit('app:instanceHealthUpdated', instance.id, instanceHealth);
    }
    return instanceHealth;
  }

  async fetchInstanceEndpoints(instance: Instance): Promise<string[]> {
    const client = new ActuatorClient(instance.actuatorUrl);
    try {
      const endpoints = await client.endpoints();
      const oldEndpoints = this.endpointsCache.get<string[]>(instance.id);
      this.endpointsCache.set(instance.id, endpoints);
      if (
        oldEndpoints?.length !== endpoints.length ||
        !oldEndpoints?.every((endpoint) => endpoints.includes(endpoint))
      ) {
        this.events.emit('app:instanceEndpointsUpdated', instance.id, endpoints);
      }
      return endpoints;
    } catch (e: unknown) {
      console.error(`Couldn't fetch endpoints for instance ${instance.id}`, e);
      return [];
    }
  }

  private computeAndSaveApplicationHealth(applicationId: string) {
    const oldHealth = this.applicationHealthCache.get<ApplicationHealth>(applicationId);
    const newStatus = this.getApplicationHealthStatus(applicationId);
    const newHealth: ApplicationHealth = {
      status: newStatus,
      lastUpdateTime: Date.now(),
      lastStatusChangeTime: oldHealth?.status !== newStatus ? Date.now() : oldHealth?.lastStatusChangeTime,
    };
    this.applicationHealthCache.set(applicationId, newHealth);
    if (oldHealth?.status !== this.getApplicationHealthStatus(applicationId)) {
      this.events.emit('app:applicationHealthUpdated', applicationId);
    }
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

export const instanceService = new InstanceService();
