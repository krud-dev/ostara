package dev.krud.boost.daemon.configuration.instance

import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityResolver
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.crudframework.crud.handler.CrudHandler
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstanceService(
  private val crudHandler: CrudHandler,
  private val instanceAbilityResolvers: List<InstanceAbilityResolver>,
  private val actuatorClientProvider: InstanceActuatorClientProvider
) {

  fun getInstance(instanceId: UUID): Instance? {
    return crudHandler
      .show(instanceId, Instance::class.java)
      .execute()
  }

  fun getInstanceOrThrow(instanceId: UUID): Instance {
    return getInstance(instanceId) ?: error("Instance $instanceId not found")
  }

  /**
   * Resolves the abilities of an instance.
   */
  // TODO: cache
  fun resolveAbilities(instance: Instance): Set<InstanceAbility> {
    val actuatorClient = actuatorClientProvider.provide(instance)
    val endpoints = actuatorClient.endpoints()
    val options = InstanceAbilityResolver.Options(instance, endpoints, actuatorClient)
    return instanceAbilityResolvers
      .filter {
        it.hasAbility(
          options
        )
      }
      .map { it.ability }
      .toSet()
  }

  fun hasAbility(instance: Instance, ability: InstanceAbility): Boolean {
    return resolveAbilities(instance).contains(ability)
  }

  fun hasAbilityOrThrow(instance: Instance, ability: InstanceAbility) {
    if (!hasAbility(instance, ability)) {
      error("Instance ${instance.id} does not have ability '$ability'")
    }
  }
}
