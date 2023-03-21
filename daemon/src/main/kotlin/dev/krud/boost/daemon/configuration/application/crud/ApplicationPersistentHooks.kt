package dev.krud.boost.daemon.configuration.application.crud

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.crudframework.crud.hooks.interfaces.DeleteHooks
import org.springframework.stereotype.Component
import java.util.*

@Component
class ApplicationPersistentHooks(
    private val instanceKrud: Krud<Instance, UUID>
) : DeleteHooks<UUID, Application> {
    override fun onDelete(entity: Application) {
        instanceKrud.deleteByFilter {
            where {
                Instance::parentApplicationId Equal entity.id
            }
        }
    }
}