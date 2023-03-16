package dev.krud.boost.daemon.configuration.instance.crud

import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.hostname.InstanceHostnameResolver
import dev.krud.crudframework.crud.hooks.interfaces.CreateFromHooks
import dev.krud.crudframework.crud.hooks.interfaces.CreateHooks
import dev.krud.crudframework.crud.hooks.interfaces.UpdateFromHooks
import dev.krud.crudframework.crud.hooks.interfaces.UpdateHooks
import org.springframework.stereotype.Component
import java.util.*

@Component
class InstancePersistentHooks(
    private val instanceHostnameResolver: InstanceHostnameResolver
) : CreateHooks<UUID, Instance>, UpdateHooks<UUID, Instance>, CreateFromHooks<UUID, Instance>, UpdateFromHooks<UUID, Instance> {
    override fun onCreate(entity: Instance) {
        updateHostname(entity)
    }

    override fun onUpdate(entity: Instance) {
        updateHostname(entity)
    }

    override fun onCreateFrom(entity: Instance, ro: Any) {
        updateHostname(entity)
    }

    override fun onUpdateFrom(entity: Instance, ro: Any) {
        updateHostname(entity)
    }

    private fun updateHostname(entity: Instance) {
        val hostname = instanceHostnameResolver.resolveHostname(entity.actuatorUrl)
        if (hostname != null) {
            entity.hostname = hostname
        }
    }
}