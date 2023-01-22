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

const metricAbilityResolver = (
  type: InstanceAbility,
  metricNames: string[],
  mode: 'all' | 'any' = 'all'
): AbilityResolvers => ({
  type,
  hasAbility: async (instanceId: string, endpoints: string[]) => {
    if (!endpoints.includes('metrics')) {
      return false;
    }
    const client = actuatorClientStore.getActuatorClient(instanceId);
    try {
      const metrics = await client.metrics();
      if (mode === 'all') {
        return metricNames.every((metricName) => metrics.names.includes(metricName));
      }
      return metricNames.some((metricName) => metrics.names.includes(metricName));
    } catch (e) {
      return false;
    }
  },
});

export const abilityResolvers: AbilityResolvers[] = [
  endpointAbilityResolver('metrics', 'metrics'),
  endpointAbilityResolver('env', 'env'),
  endpointAbilityResolver('beans', 'beans'),
  endpointAbilityResolver('quartz', 'quartz'),
  endpointAbilityResolver('flyway', 'flyway'),
  endpointAbilityResolver('liquibase', 'liquibase'),
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
  metricAbilityResolver(
    'cache-statistics',
    ['cache.gets', 'cache.puts', 'cache.evictions', 'cache.hits', 'cache.misses', 'cache.removals', 'cache.size'],
    'any'
  ), // Should be expanded to all other metrics
  metricAbilityResolver('http-request-statistics', ['http.server.requests']),
];
