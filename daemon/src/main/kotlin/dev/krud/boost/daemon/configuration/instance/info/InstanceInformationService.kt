package dev.krud.boost.daemon.configuration.instance.info

import java.util.*

interface InstanceInformationService {
    fun getInstanceActiveProfiles(instanceId: UUID): Set<String>
}