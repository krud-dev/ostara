package dev.krud.boost.daemon.configuration.application

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.messaging.ApplicationDisableSslVerificationChangedMessage
import dev.krud.boost.daemon.configuration.application.messaging.ApplicationMovedEventMessage
import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.exception.throwBadRequest
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.boost.daemon.utils.resolve
import dev.krud.crudframework.crud.handler.krud.Krud
import io.github.oshai.KotlinLogging
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.messaging.Message
import org.springframework.stereotype.Service
import java.util.*

@Service
class ApplicationService(
    private val applicationKrud: Krud<Application, UUID>,
    private val instanceKrud: Krud<Instance, UUID>,
    private val instanceAbilityService: InstanceAbilityService,
    private val systemEventsChannel: PublishSubscribeChannel,
    private val cacheManager: CacheManager
) {
    private val applicationDisableSslVerificationCache by cacheManager.resolve()

    fun getApplication(applicationId: UUID): Application? {
        log.debug { "Getting application $applicationId from database" }
        val application = applicationKrud.showById(applicationId)
        if (application == null) {
            log.debug { "Application $applicationId not found" }
        } else {
            log.debug { "Application $applicationId found" }
        }
        return application
    }

    fun getApplicationInstances(applicationId: UUID): List<Instance> {
        log.debug {
            "Getting instances for application $applicationId from database"
        }
        return instanceKrud
            .searchByFilter {
                where {
                    Instance::parentApplicationId Equal applicationId
                }
            }
            .results.apply {
                log.debug { "Found $size instances for application $applicationId" }
            }
    }

    fun getApplicationOrThrow(applicationId: UUID): Application {
        return getApplication(applicationId) ?: throwNotFound("Application $applicationId not found")
    }

    @Cacheable("applicationDisableSslVerificationCache", key = "#applicationId")
    fun getApplicationDisableSslVerification(applicationId: UUID): Boolean {
        return getApplicationOrThrow(applicationId).disableSslVerification
    }

    fun hasAbility(application: Application, vararg abilities: InstanceAbility): Boolean {
        log.debug { "Checking if application ${application.id} has abilities '${abilities.joinToString()}'" }
        return abilities.all { ability ->
            getApplicationInstances(application.id).any { instance ->
                instanceAbilityService.hasAbility(instance, ability)
            }
        }.apply {
            log.debug { "Application ${application.id} has abilities '${abilities.joinToString()}': $this" }
        }
    }

    fun getAbilities(applicationId: UUID): Set<InstanceAbility> {
        log.debug { "Getting abilities for application $applicationId" }
        getApplicationOrThrow(applicationId)
        return getApplicationInstances(applicationId).flatMap { instance ->
            instanceAbilityService.getAbilities(instance)
        }
            .filter {
                it in ALLOWED_INSTANCE_ABILITIES_FOR_APP
            }
            .toSet()
            .apply {
                log.debug {
                    "Application $applicationId has abilities $this"
                }
            }
    }

    fun hasAbilityOrThrow(application: Application, vararg abilities: InstanceAbility) {
        if (!hasAbility(application, *abilities)) {
            throwBadRequest("Application ${application.id} does not have one or more abilities '${abilities.joinToString(", ")}'")
        }
    }

    fun moveApplication(applicationId: UUID, newParentFolderId: UUID?, newSort: Double?): Application {
        log.debug { "Moving application $applicationId to folder $newParentFolderId with sort $newSort" }
        val application = getApplicationOrThrow(applicationId)
        if (application.parentFolderId == newParentFolderId && application.sort == newSort) {
            log.debug { "Application $applicationId is already in folder $newParentFolderId with sort $newSort, skipping update" }
            return application
        }
        application.parentFolderId = newParentFolderId // TODO: check if folder exists, should fail on foreign key for now
        application.sort = newSort
        val updatedApplication = applicationKrud.update(application)
        systemEventsChannel.send(ApplicationMovedEventMessage(ApplicationMovedEventMessage.Payload(applicationId, application.parentFolderId, newParentFolderId, newSort)))
        return updatedApplication
    }

    @ServiceActivator(inputChannel = "systemEventsChannel")
    fun onSystemEvent(message: Message<*>) {
        when (message) {
            is ApplicationDisableSslVerificationChangedMessage -> {
                applicationDisableSslVerificationCache.put(message.payload.applicationId, message.payload.newValue)
            }
        }
    }

    companion object {
        private val log = KotlinLogging.logger { }
        private val ALLOWED_INSTANCE_ABILITIES_FOR_APP: Set<InstanceAbility> = setOf(
            InstanceAbility.CACHES,
            InstanceAbility.CACHE_STATISTICS,
            InstanceAbility.LOGGERS
        )
    }
}