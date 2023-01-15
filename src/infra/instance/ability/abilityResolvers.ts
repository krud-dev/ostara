import { InstanceAbility } from '../models/ability';
import { actuatorClientStore } from '../../actuator/actuatorClientStore';

interface AbilityResolvers {
  type: InstanceAbility;
  hasAbility(instanceId: string, endpoints: string[]): Promise<boolean>;
}

const endpointAbilityResolver = (type: InstanceAbility, endpoint: string): AbilityResolvers => ({
  type,
  hasAbility: async (instanceId: string, endpoints: string[]) => endpoints.includes(endpoint),
});

const metricAbilityResolver = (type: InstanceAbility, metrics: string[]): AbilityResolvers => ({
  type,
  hasAbility: async (instanceId: string, endpoints: string[]) => {
    if (!endpoints.includes('metrics')) {
      return false;
    }
    const client = actuatorClientStore.getActuatorClient(instanceId);
    try {
      await Promise.all(metrics.map((metric) => client.metric(metric)));
    } catch (e) {
      return false;
    }
    return true;
  },
});

export const abilityResolvers: AbilityResolvers[] = [
  endpointAbilityResolver('metrics', 'metrics'),
  endpointAbilityResolver('env', 'env'),
  endpointAbilityResolver('beans', 'beans'),
  endpointAbilityResolver('quartz', 'quartz'),
  endpointAbilityResolver('flyway', 'flyway'),
  endpointAbilityResolver('loggers', 'loggers'),
  endpointAbilityResolver('caches', 'caches'),
  endpointAbilityResolver('threaddump', 'threaddump'),
  endpointAbilityResolver('heapdump', 'heapdump'),
  endpointAbilityResolver('shutdown', 'shutdown'),
  endpointAbilityResolver('refresh', 'refresh'),
  endpointAbilityResolver('integrationgraph', 'integrationgraph'),
  endpointAbilityResolver('properties', 'configprops'),
  endpointAbilityResolver('mappings', 'mappings'),
  endpointAbilityResolver('scheduledtasks', 'scheduledtasks'),
  metricAbilityResolver('cache-statistics', ['cache.gets']), // Should be expanded to all other metrics
  metricAbilityResolver('http-request-statistics', ['http.server.requests']),
];
