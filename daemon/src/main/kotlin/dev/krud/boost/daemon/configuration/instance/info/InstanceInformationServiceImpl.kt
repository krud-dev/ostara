package dev.krud.boost.daemon.configuration.instance.info

import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstanceInformationServiceImpl(
    private val instanceService: InstanceService,
    private val instanceAbilityService: InstanceAbilityService,
    private val instanceActuatorClientProvider: InstanceActuatorClientProvider
) : InstanceInformationService {
    override fun getInstanceActiveProfiles(instanceId: UUID): Set<String> {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        if (!instanceAbilityService.hasAbility(instance, InstanceAbility.ENV)) {
            return emptySet()
        }

        return instanceActuatorClientProvider.doWith(instance) { client ->
            client.env()
                .getOrNull()
                ?.activeProfiles
                ?.toSet() ?: emptySet()
        }
    }
}