import NodeCache from 'node-cache';
import { abilityResolvers } from './ability/abilityResolvers';
import EventEmitter from 'events';
import { actuatorClientStore } from '../actuator/actuatorClientStore';
import { BrowserWindow } from 'electron';
import { InstanceAbility } from './models/ability';
import { systemEvents } from '../events';
import { configurationService } from '../configuration/configurationService';

class InstanceAbilityService {
  private readonly instanceAbilityCache = new NodeCache();

  private readonly endpointsCache = new NodeCache();

  private readonly events: EventEmitter = new EventEmitter();

  constructor() {
    systemEvents.on('instance-updated', (instance) => this.fetchInstanceEndpoints(instance.id));
    systemEvents.on('instance-created', (instance) => this.fetchInstanceEndpoints(instance.id));
    systemEvents.on('instance-deleted', (instance) => this.fetchInstanceEndpoints(instance.id));
  }

  initializeListeners(window: BrowserWindow) {
    this.events.addListener('app:instanceEndpointsUpdated', (key: string, value: string[]) => {
      window.webContents.send('app:instanceEndpointsUpdated', key, value);
    });
    this.events.addListener('app:instanceAbilitiesUpdated', (key: string, value: InstanceAbility[]) => {
      window.webContents.send('app:instanceAbilitiesUpdated', key, value);
    });
  }

  getCachedInstanceEndpoints(instanceId: string): string[] {
    return this.endpointsCache.get<string[]>(instanceId) ?? [];
  }

  getCachedInstanceAbilities(instanceId: string): InstanceAbility[] {
    return this.instanceAbilityCache.get<InstanceAbility[]>(instanceId) || [];
  }

  async fetchInstanceEndpoints(instanceId: string): Promise<string[]> {
    if (!configurationService.itemExists(instanceId)) {
      return [];
    }
    const client = actuatorClientStore.getActuatorClient(instanceId);
    try {
      const endpoints = await client.endpoints();
      const oldEndpoints = this.endpointsCache.get<string[]>(instanceId);
      this.endpointsCache.set(instanceId, endpoints);
      if (
        oldEndpoints?.length !== endpoints.length ||
        !oldEndpoints?.every((endpoint) => endpoints.includes(endpoint))
      ) {
        this.events.emit('app:instanceEndpointsUpdated', instanceId, endpoints);
      }

      await this.refreshInstanceAbilities(instanceId);
      return endpoints;
    } catch (e: unknown) {
      console.error(`Couldn't fetch endpoints for instance ${instanceId}`, e);
      return [];
    }
  }

  private async refreshInstanceAbilities(instanceId: string): Promise<InstanceAbility[]> {
    const oldAbilities = this.instanceAbilityCache.get<InstanceAbility[]>(instanceId) || [];
    const endpoints = this.getCachedInstanceEndpoints(instanceId);
    const abilities: InstanceAbility[] = [];
    for (const abilityResolver of abilityResolvers) {
      const hasAbility = await abilityResolver.hasAbility(instanceId, endpoints);
      if (hasAbility) {
        abilities.push(abilityResolver.type);
      }
    }

    if (oldAbilities.length !== abilities.length || !oldAbilities.every((ability) => abilities.includes(ability))) {
      this.events.emit('app:instanceAbilitiesUpdated', instanceId, abilities);
    }
    this.instanceAbilityCache.set(instanceId, abilities);
    return abilities;
  }
}

export const instanceAbilityService = new InstanceAbilityService();
