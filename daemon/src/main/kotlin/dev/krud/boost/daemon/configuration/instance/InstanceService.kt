package dev.krud.boost.daemon.configuration.instance

import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityResolver
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceCreatedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceMovedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceUpdatedEventMessage
import dev.krud.boost.daemon.exception.throwBadRequest
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.boost.daemon.utils.resolve
import dev.krud.crudframework.crud.handler.CrudHandler
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.messaging.Message
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstanceService(
    private val crudHandler: CrudHandler,
    private val instanceAbilityResolvers: List<InstanceAbilityResolver>,
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val systemEventsChannel: PublishSubscribeChannel,
    cacheManager: CacheManager
) {
    private val instanceAbilityCache by cacheManager.resolve()

    fun getAllInstances(): List<Instance> {
        return crudHandler
            .index(null, Instance::class.java)
            .execute()
            .results
    }

    fun getInstance(instanceId: UUID): Instance? {
        return crudHandler
            .show(instanceId, Instance::class.java)
            .execute()
    }

    fun getInstanceOrThrow(instanceId: UUID): Instance {
        return getInstance(instanceId) ?: throwNotFound("Instance $instanceId not found")
    }

    /**
     * Resolves the abilities of an instance.
     */
    @Cacheable(cacheNames = ["instanceAbilityCache"], key = "#instance.id", unless = "#result.isEmpty()")
    fun resolveAbilities(instance: Instance): Set<InstanceAbility> {
        val actuatorClient = actuatorClientProvider.provide(instance)
        val endpoints = actuatorClient.endpoints().getOrElse { return emptySet() }
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

    fun hasAbility(instance: Instance, vararg abilities: InstanceAbility): Boolean {
        val currentAbilities = resolveAbilities(instance)
        return abilities.all { ability ->
            currentAbilities.contains(ability)
        }
    }

    fun hasAbilityOrThrow(instance: Instance, vararg abilities: InstanceAbility) {
        if (!hasAbility(instance, *abilities)) {
            throwBadRequest("Instance ${instance.id} does not have one or more abilities '${abilities.joinToString(", ")}'")
        }
    }

    fun moveInstance(instanceId: UUID, newParentApplicationId: UUID, newSort: Double?): Instance {
        val instance = getInstanceOrThrow(instanceId)
        val oldParentApplicationId = instance.parentApplicationId
        instance.parentApplicationId = newParentApplicationId
        instance.sort = newSort
        val updatedInstance = crudHandler
            .update(instance)
            .execute()
        systemEventsChannel.send(InstanceMovedEventMessage(InstanceMovedEventMessage.Payload(instanceId, oldParentApplicationId, newParentApplicationId)))
        return updatedInstance
    }

    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceCreatedEventMessage -> {
                instanceAbilityCache.evict(event.payload.instanceId)
            }

            is InstanceUpdatedEventMessage -> {
                instanceAbilityCache.evict(event.payload.instanceId)
            }

            is InstanceDeletedEventMessage -> {
                instanceAbilityCache.evict(event.payload.instanceId)
            }
        }
    }
}