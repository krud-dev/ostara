import { InstanceAbility } from '../instance/models/ability';
import { instanceAbilityService } from '../instance/InstanceAbilityService';

/**
 * Decorator which can be used to check if an instance has a specific ability.
 * Requires the instanceId to be passed as the first parameter.
 * @param abilities
 * @constructor
 */
export function HasAbility(...abilities: InstanceAbility[]) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const instanceId = args[0];
      const instanceAbilities = instanceAbilityService.getCachedInstanceAbilities(instanceId);
      if (!abilities.every((ability) => instanceAbilities.includes(ability))) {
        throw new Error(`Instance ${instanceId} doesn't have the required abilities ${abilities.join()}`);
      }
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
