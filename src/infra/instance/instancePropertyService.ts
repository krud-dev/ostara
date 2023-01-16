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
        const flattened = Object.fromEntries(
          Object.entries(
            flatten(bean.properties, {
              delimiter: '.',
              transformKey: (key: string) => paramCase(key),
            })
          ).map(([key, value]) => {
            return [`${bean.prefix}.${key}`, value];
          })
        );
        const unflattened = unflatten(flattened);
        if (unflattened && typeof unflattened === 'object') {
          config[contextName] = merge(config[contextName] || {}, unflattened);
        }
      }
    }
    return config;
  }
}

export const instancePropertyService = new InstancePropertyService();
