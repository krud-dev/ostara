package dev.krud.boost.daemon.configuration.application.crud

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.crudframework.crud.handler.CrudHandler
import dev.krud.crudframework.crud.hooks.interfaces.DeleteHooks
import org.springframework.stereotype.Component
import java.util.*

@Component
class ApplicationPersistentHooks(
    private val crudHandler: CrudHandler
) : DeleteHooks<UUID, Application> {
    override fun onDelete(entity: Application) {
        entity.instances.forEach {
            crudHandler.delete(it.id, Instance::class.java).execute()
        }
    }
}