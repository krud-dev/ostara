import { actuatorClientStore } from '../actuator/actuatorClientStore';
import { flatten, unflatten } from 'flat';
import { paramCase } from 'change-case';
import { merge } from 'lodash';

class InstancePropertyService {
  async getProperties(instanceId: string): Promise<{ [key: string]: { [key: string]: unknown } }> {
    const client = actuatorClientStore.getActuatorClient(instanceId);
    const config: { [key: string]: { [key: string]: unknown } } = {};
    const configProps = await client.configProps();
    for (const [contextName, context] of Object.entries(configProps.contexts)) {
      for (const bean of Object.values(context.beans)) {
        const configHierarchy = unflatten(
          flatten(bean.properties, {
            delimiter: '.',
            transformKey: (key: string) => `${bean.prefix}.${paramCase(key)}`,
          })
        );
        if (configHierarchy && typeof configHierarchy === 'object') {
          config[contextName] = merge(config[contextName] || {}, configHierarchy);
        }
      }
    }
    return config;
  }
}

export const instancePropertyService = new InstancePropertyService();
