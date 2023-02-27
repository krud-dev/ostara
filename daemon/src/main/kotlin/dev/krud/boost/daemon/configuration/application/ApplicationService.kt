package dev.krud.boost.daemon.configuration.application

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.exception.throwBadRequest
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.crudframework.crud.handler.CrudHandler
import org.springframework.stereotype.Service
import java.util.*

@Service
class ApplicationService(
    private val crudHandler: CrudHandler,
    private val instanceAbilityService: InstanceAbilityService
) {
    fun getApplication(applicationId: UUID): Application? {
        return crudHandler
            .show(applicationId, Application::class.java)
            .execute()
    }

    fun getApplicationOrThrow(applicationId: UUID): Application {
        return getApplication(applicationId) ?: throwNotFound("Application $applicationId not found")
    }

    fun hasAbility(application: Application, vararg abilities: InstanceAbility): Boolean {
        return abilities.all { ability ->
            application.instances.any { instance ->
                instanceAbilityService.hasAbility(instance, ability)
            }
        }
    }

    fun hasAbilityOrThrow(application: Application, vararg abilities: InstanceAbility) {
        if (!hasAbility(application, *abilities)) {
            throwBadRequest("Application ${application.id} does not have one or more abilities '${abilities.joinToString(", ")}'")
        }
    }

    fun moveApplication(applicationId: UUID, newParentFolderId: UUID?, newSort: Double?): Application {
        val application = getApplicationOrThrow(applicationId)
        application.parentFolderId = newParentFolderId // TODO: check if folder exists, should fail on foreign key for now
        application.sort = newSort
        return crudHandler
            .update(application)
            .execute()
    }
}