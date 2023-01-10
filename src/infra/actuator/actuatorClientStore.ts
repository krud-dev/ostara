import { ActuatorClient } from './actuatorClient';
import { configurationService } from '../configuration/configurationService';
import NodeCache from 'node-cache';
import { systemEvents } from '../events';

class ActuatorClientStore {
  private readonly clients = new NodeCache();

  constructor() {
    systemEvents.on('instance-deleted', (instance) => this.clearInstance(instance.id));
    systemEvents.on('instance-updated', (instance) => this.clearInstance(instance.id));
  }

  getActuatorClient(instanceId: string): ActuatorClient {
    if (!this.clients.has(instanceId)) {
      const instance = configurationService.getInstanceOrThrow(instanceId);
      this.clients.set(instanceId, new ActuatorClient(instance.actuatorUrl));
    }

    return this.clients.get(instanceId)!;
  }

  clearInstance(instanceId: string): void {
    this.clients.del(instanceId);
  }
}

export const actuatorClientStore = new ActuatorClientStore();
